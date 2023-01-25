"use strict";

/**
 * A set of functions called "actions" for `app`
 */
const { get, groupBy, differenceBy } = require("lodash");

async function findTable(ctx) {
  const { services } = strapi;
  const { validateRequest, appFindTableRequestSchema } = services.validation;
  const { id } = await validateRequest(
    ctx,
    appFindTableRequestSchema,
    ctx.params
  );

  const table = await services.table.findOne({ id }, [
    "organization",
    "organization.currency",
    "organization.languages",
    "organization.logo",
    "organization.orderStatuses",
    "organization.initialOrderStatus",
    "venue",
    "venue.location",
  ]);
  if (!table) {
    return ctx.throw(404, `Table ${id} not found`);
  }
  if (!table.venue || !table.venue.location) {
    return ctx.throw(400, `Table ${id} isn't connected to a location`);
  }

  const { orderStatuses, initialOrderStatus, ...org } = table.organization;

  const hasUserNotifications =
    [...(orderStatuses ?? []), initialOrderStatus].filter(
      (it) => it && it.notifySender
    ).length > 0;

  const organization = services.parser.mapOrganizationResponse(org);

  console.log("Organization: ", organization);

  const currency = organization.currency;
  const currencies = strapi.localization.exchangeRates[currency];
  currencies[currency] = 1;
  const languages = organization.languages;
  const [menus, customOrderTypes, paymentConfig] = await Promise.all([
    services.menu.find({ venues: table.venue.id }).then((menus) => {
      const menusOrder = get(table, "venue.menusOrder", []);
      const menusUnordered = menus.map((it) => {
        const menu = services.parser.mapMenuResponse(it);
        delete menu.categories;
        delete menu.venues;
        delete menu.itemCount;
        return menu;
      });
      const ids = services.parser.orderIdsBy(
        menusUnordered.map((it) => it.id),
        menusOrder
      );
      return ids.map((it) => menusUnordered.find((menu) => menu.id === it));
    }),
    services["order-type"]
      .find(
        {
          organization: organization.id,
        },
        []
      )
      .then((orderTypes) =>
        orderTypes.map((it) => services.parser.mapOrderTypeResponse(it))
      ),
    services.organization.findPublicPaymentConfig(organization.id),
  ]);

  return ctx.send({
    customOrderTypes,
    menus,
    currency,
    currencies,
    languages,
    logo: organization.logo,
    style: organization.style,
    organization: organization.id,
    mode: organization.mode,
    venue: table.venue,
    hasUserNotifications,
    loginRequired: hasUserNotifications,
    paymentConfig,
  });
}

async function findCategories(ctx) {
  const { services } = strapi;
  const { validateRequest, appFindCategoriesRequestSchema } =
    services.validation;

  const { menuId } = await validateRequest(
    ctx,
    appFindCategoriesRequestSchema,
    ctx.params
  );

  const entities = await strapi
    .query("category")
    .find({ ...ctx.query, menus: menuId }, [
      "image",
      "items",
      "items.image",
      "items.optionGroups",
      "items.optionGroups.options",
    ]);

  return ctx.send(entities.map(services.parser.mapAppCategoryResponse));
}

async function findOrders(ctx) {
  const { services } = strapi;
  const { validateRequest, orderHistoryFindSchema } = services.validation;

  const { installation, user, ...query } = await validateRequest(
    ctx,
    orderHistoryFindSchema,
    {
      ...ctx.query,
      installation: ctx.params.installation,
      user: ctx.state.user,
    }
  );

  const entities = await services.order.findOrderHistory(
    installation,
    user,
    query
  );

  return ctx.send(entities.map(services.parser.mapOrderResponse));
}

async function findOrder(ctx) {
  const { services } = strapi;
  const { validateRequest, orderHistoryFindSchema } = services.validation;

  const { installation, user, order, ...query } = await validateRequest(
    ctx,
    orderHistoryFindSchema,
    {
      ...ctx.query,
      installation: ctx.params.installation,
      order: ctx.params.order,
      user: ctx.state.user,
    }
  );

  const entity = await services.order.findOneOrderHistory(
    installation,
    user,
    order,
    query
  );
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapOrderResponse(entity));
}

async function findTags(ctx) {
  const { services } = strapi;
  const { validateRequest, tagFindAppSchema } = services.validation;
  const { organization } = await validateRequest(
    ctx,
    tagFindAppSchema,
    ctx.params
  );

  const entities = await services.tag.findByItemAndOrganization(
    null,
    organization
  );

  return ctx.send(entities.map(services.parser.mapTagResponse));
}

// warning: use this only in debug mode. on staging and production this can cause serious security problems
async function debug(ctx) {
  const knex = strapi.connections.default;

  const [allItems, oldGroups, relations] = await Promise.all([
    strapi.query("item").find({ _limit: -1 }),
    strapi.query("variation.option-group").find({ _limit: -1 }),
    await knex("items_components").where("field", "optionGroups"),
  ]);
  const mapped = oldGroups
    .map((it) => {
      const item = relations?.find(
        (relation) => relation["component_id"] === it.id
      )?.item_id;
      const organization =
        allItems.find((it) => it?.id === item.id)?.organization ??
        it.options?.find((it) => it.organization)?.organization;
      return {
        id: it.id,
        selectionMode: it.selectionMode,
        required: it.required ?? false,
        accessLevel: it.accessLevel ?? "item",
        name: strapi.services.parser.mapLabelResponse(it.name),
        description: strapi.services.parser.mapLabelResponse(it.description),
        options: it.options?.map(strapi.services.parser.mapRelationId) ?? [],
        item,
        organization,
      };
    })
    .filter((it) => it.organization && it.item);

  const existing = await strapi.query("item-group").find({ _limit: -1 });
  console.log("Existing: ", existing.length);

  const unmigrated = differenceBy(mapped, existing, "id");

  console.log("unmigrated: ", unmigrated);
  if (unmigrated.length) {
    await knex.transaction(async (trx) => {
      const grouped = Object.entries(groupBy(unmigrated, "item")).map(
        ([key, value]) => ({
          id: parseInt(key, 10),
          optionGroups: value.map((it) => it.id),
        })
      );
      await Promise.all(
        unmigrated.map((group) =>
          strapi
            .query("item-group")
            .model.forge({
              id: group.id,
              selectionMode: group.selectionMode ?? "single",
              required: group.required,
              accessLevel: group.accessLevel,
              nameLocalized: JSON.stringify(group.name),
              descriptionLocalized: JSON.stringify(group.description),
              organization: group.organization,
              published_at: new Date(),
            })
            .save(null, { transacting: trx, method: "insert", debug: false })
        )
      );

      console.log(
        "Forged: ",
        unmigrated.map((it) => it.id)
      );

      await Promise.all(
        unmigrated.map((group) =>
          strapi
            .query("item-group")
            .update(
              { id: group.id, organization: group.organization },
              { options: group.options },
              { transacting: trx }
            )
        )
      );

      console.log("Bound options");

      await Promise.all(
        grouped.map((item) =>
          strapi
            .query("item")
            .update(
              { id: item.id },
              { optionGroups: item.optionGroups },
              { transacting: trx }
            )
        )
      );
      console.log("Updated");
    });
  }

  console.log("Finding biggest item-group ID");

  const id = await strapi
    .query("item-group")
    .find({ _sort: "id:DESC", _limit: 1 })
    .then((it) => get(it, "[0].id"));

  console.log("Updating autoincrement to the ", id + 1);

  await knex.raw(`ALTER SEQUENCE item_groups_id_seq RESTART WITH ${id + 1}`);

  console.log("Updated autoincrement");

  const itemOptions = await strapi
    .query("item-option")
    .find({ _limit: -1, nameLocalized_null: true })
    .then((options) =>
      options.map(strapi.services.parser.mapItemOptionResponse)
    );

  if (itemOptions.length) {
    console.log("Updating item option names...");
    await knex.transaction(async (trx) => {
      await Promise.all(
        itemOptions.map((option) =>
          strapi.query("item-option").update(
            { id: option.id },
            {
              nameLocalized: option.name,
              descriptionLocalized: option.description,
            },
            { transacting: trx }
          )
        )
      );
    });
  }

  const unmigratedItems = allItems.filter(
    (it) =>
      (!!it.name?.length && !it.nameLocalized) ||
      (!!it.description?.length && !it.descriptionLocalized) ||
      (!!it.longDescription?.length && !it.longDescriptionLocalized)
  );
  console.log("Unmigrated items: ", unmigratedItems);

  await knex.transaction(async (trx) => {
    await Promise.all(
      unmigratedItems.map((it) =>
        strapi.query("item").update(
          { id: it.id },
          {
            nameLocalized: strapi.services.parser.mapLabelResponse(
              it.name ?? []
            ),
            descriptionLocalized: strapi.services.parser.mapLabelResponse(
              it.description ?? []
            ),
            longDescriptionLocalized: strapi.services.parser.mapLabelResponse(
              it.longDescription ?? []
            ),
          },
          { transacting: trx }
        )
      )
    );
  });

  // todo: add insertion logic
  return ctx.send(itemOptions);
}

async function deleteProfile(ctx) {
  const { services } = strapi;
  const { validateRequest, profileDeleteSchema } = services.validation;

  await validateRequest(ctx, profileDeleteSchema, { user: ctx.state.user });

  const entity = await services.app.deleteProfile(ctx.state.user);

  return ctx.send(services.parser.mapUserResponse(entity || ctx.state.user));
}

module.exports = {
  findTable,
  findCategories,
  findOrders,
  findOrder,
  debug,
  findTags,
  deleteProfile,
};
