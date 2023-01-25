"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const { flattenDeep, sum, get, flatten } = require("lodash");

async function findOrderType(id, organization) {
  return strapi.query("order-type").findOne({ id: id, organization }, []);
}

async function findUserAddress(id) {
  return id ? await strapi.query("user-address").findOne({ id }, []) : null;
}

async function findTable(id) {
  return strapi
    .query("table")
    .findOne({ id }, [
      "organization",
      "organization.currency",
      "venue",
      "venue.location",
      "venue.name",
    ]);
}

async function findInstallation(uid) {
  //change
  return strapi.query("installation").findOne({ uid }, []);
}

async function findItems(ids, organization) {
  return strapi
    .query("item")
    .find({ id_in: ids }, [
      "optionGroups",
      "categories",
      "categories.name",
      "optionGroups.options",
    ]);
}

async function findItemOptions(ids, organization) {
  return strapi.query("item-option").find({ id_in: ids }, []);
}

async function findVenue(id, organization) {
  return strapi.query("venue").findOne({ id, organization }, []);
}

async function findLocation(id, organization) {
  return strapi.query("location").findOne({ id, organization }, []);
}

async function findCategories(ids, organization) {
  return strapi.query("category").find({ id_in: ids, organization }, []);
}

function sumOrderAmount(requestItems, items, itemOptions) {
  const itemsObj = items.reduce((obj, item) => {
    if (item.id in obj) return obj;
    obj[item.id] = item;
    return obj;
  }, {});

  const itemOptionsObj = itemOptions.reduce((obj, option) => {
    if (option.id in obj) return obj;
    obj[option.id] = option;
    return obj;
  }, {});

  return requestItems.reduce((price, reqItem) => {
    const itemInfo = itemsObj[reqItem.id];
    const optionsPrice = sum(
      flatten(reqItem.optionGroups.map((og) => og.options)).map(
        (option) => (option.amount ?? 1) * itemOptionsObj[option.id].price
      )
    );
    return price + (reqItem.amount ?? 1) * (itemInfo.price + optionsPrice);
  }, 0);
}

async function processOrderCreateParams(params) {
  const isCustom = params.type && !params.items;

  //change - verify metoda vec dohvati instalaciju
  const [table] = await Promise.all([findTable(params.table)]);

  const organization = table.organization;
  const currency = table.organization.currency;
  const status = table.organization.initialOrderStatus;

  const [location, venue, userAddress, type, items, itemOptions] =
    await Promise.all([
      findLocation(table.venue.location.id, organization.id),
      findVenue(table.venue.id, organization.id),
      findUserAddress(
        get(params, "userAddress.id", get(params, "userAddress"))
      ),
      isCustom
        ? findOrderType(params.type, organization.id)
        : Promise.resolve(),
      !isCustom
        ? findItems(
            params.items.map((it) => it.id),
            organization.id
          )
        : Promise.resolve(),
      !isCustom
        ? findItemOptions(
            flattenDeep(
              params.items.map((it) =>
                it.optionGroups.map((it) => it.options.map((it) => it.id))
              )
            ),
            organization.id
          )
        : Promise.resolve(),
    ]);

  const categories = !isCustom
    ? await findCategories(
        flattenDeep(items.map((it) => it.categories.map((it) => it.id))),
        organization.id
      )
    : undefined;

  const amount = !isCustom
    ? sumOrderAmount(params.items, items, itemOptions)
    : undefined;

  return {
    request: params,
    table,
    venue,
    location,
    organization,
    status,
    currency,
    //change
    installation: params.installation,
    type,
    items,
    itemOptions,
    categories,
    amount,
    note: params.note,
    userAddress,
  };
}

function mapTableSnapshot(table) {
  const { sanitizeEntity } = strapi.services.parser;
  const entity = sanitizeEntity(table, { model: strapi.models.table });
  delete entity.venue;
  return entity;
}

function mapVenueSnapshot(venue) {
  const { sanitizeEntity, mapLabelResponse } = strapi.services.parser;
  const entity = sanitizeEntity(venue, { model: strapi.models.venue });
  entity.name = mapLabelResponse(venue.name);
  return entity;
}

function mapLocationSnapshot(location) {
  const { sanitizeEntity, mapLabelResponse } = strapi.services.parser;
  const entity = sanitizeEntity(location, { model: strapi.models.location });
  entity.name = mapLabelResponse(location.name);
  return entity;
}

function mapInstallationSnapshot(installation) {
  const { sanitizeEntity } = strapi.services.parser;
  const entity = sanitizeEntity(installation, {
    model: strapi.models.installation,
  });
  delete entity.uuid;
  delete entity.user;
  return entity;
}

function mapCurrencySnapshot(currency) {
  return currency.iso;
}

function mapCategoriesSnapshot(categories) {
  const { sanitizeEntity, mapLabelResponse } = strapi.services.parser;
  return categories.map((it) => {
    const category = sanitizeEntity(it, { model: strapi.models.category });
    delete category.organization;
    category.name = mapLabelResponse(category.name);
    category.description = mapLabelResponse(category.description);
    return category;
  });
}

function mapUserAddressSnapshot(userAddress) {
  const { mapUserAddressResponse } = strapi.services.parser;
  const entity = mapUserAddressResponse(userAddress);
  delete entity.user;
  return entity;
}

function mapItemsSnapshot(itemsRequest, items, itemOptions) {
  const { sanitizeEntity, mapLabelResponse } = strapi.services.parser;

  return itemsRequest.map((item) => {
    const fullItem = sanitizeEntity(
      items.find((it) => it.id === item.id),
      { model: strapi.models.item }
    );

    const optionGroups = item.optionGroups
      .map((optionGroup) => {
        const fullOptionGroup = fullItem.optionGroups.find(
          (it) => it.id === optionGroup.id
        );

        const options = optionGroup.options
          .map((option) => {
            let fullOption = itemOptions.find((it) => option.id === it.id);
            if (fullOption) {
              fullOption = sanitizeEntity(fullOption, {
                model: strapi.models["item-option"],
              });
              fullOption.name =
                fullOption.nameLocalized ??
                mapLabelResponse(fullOption.name ?? []);
              fullOption.amount = option.amount;
            }
            return fullOption;
          })
          .filter((it) => !!it);

        fullOptionGroup.name =
          fullOptionGroup.nameLocalized ??
          mapLabelResponse(fullOptionGroup.name ?? []);
        fullOptionGroup.description =
          fullOptionGroup.descriptionLocalized ??
          mapLabelResponse(fullOptionGroup.description ?? []);

        return {
          ...fullOptionGroup,
          options,
        };
      })
      .filter((it) => get(it, "options", []).length);

    fullItem.categories = get(fullItem, "categories", []).map((it) =>
      get(it, "id", it)
    );

    fullItem.name =
      fullItem.nameLocalized ?? mapLabelResponse(fullItem.name ?? []);
    fullItem.description =
      fullItem.descriptionLocalized ??
      mapLabelResponse(fullItem.description ?? []);
    fullItem.longDescription =
      fullItem.longDescriptionLocalized ??
      mapLabelResponse(fullItem.longDescription ?? []);
    fullItem.optionGroups = optionGroups;
    fullItem.amount = item.amount;

    return fullItem;
  });
}

function processOrderCreateData(src, data) {
  const { mapRelationId } = strapi.services.parser;

  const amount = data.amount;
  const table = mapRelationId(data.table);
  const venue = mapRelationId(data.venue);
  const location = mapRelationId(data.location);
  const organization = mapRelationId(data.organization);
  const status = mapRelationId(data.status);
  const currency = mapRelationId(data.currency);
  const installation = mapRelationId(data.installation);
  const type = data.type ? mapRelationId(data.type) : null;
  const items = data.items ? data.items.map(mapRelationId) : null;
  const itemOptions = data.itemOptions
    ? data.itemOptions.map(mapRelationId)
    : null;
  const categories = data.categories
    ? data.categories.map(mapRelationId)
    : null;

  const tableSnapshot = JSON.stringify(mapTableSnapshot(data.table));
  const venueSnapshot = JSON.stringify(mapVenueSnapshot(data.venue));
  const locationSnapshot = JSON.stringify(mapLocationSnapshot(data.location));
  const currencySnapshot = mapCurrencySnapshot(data.currency);
  const installationSnapshot = JSON.stringify(
    mapInstallationSnapshot(data.installation)
  );
  const itemsSnapshot = data.items
    ? JSON.stringify(
        mapItemsSnapshot(src.request.items, data.items, data.itemOptions)
      )
    : null;
  const categoriesSnapshot = data.categories
    ? JSON.stringify(mapCategoriesSnapshot(data.categories))
    : null;

  if (data.userAddress) {
    src.userAddress = data.userAddress.id;
    src.userAddressSnapshot = mapUserAddressSnapshot(data.userAddress);
  }

  src.amount = amount;
  src.table = table;
  src.venue = venue;
  src.location = location;
  src.organization = organization;
  src.status = status;
  src.currency = currency;
  src.installation = installation;
  src.type = type;
  src.items = items;
  src.itemOptions = itemOptions;
  src.categories = categories;

  src.tableSnapshot = tableSnapshot;
  src.venueSnapshot = venueSnapshot;
  src.locationSnapshot = locationSnapshot;
  src.currencySnapshot = currencySnapshot;
  src.installationSnapshot = installationSnapshot;
  src.itemsSnapshot = itemsSnapshot;
  src.categoriesSnapshot = categoriesSnapshot;
}

async function findOrderHistory(installation, user, query) {
  const conditions = [];
  if (user) {
    conditions.push({ user: get(user, "id", user) });
  }
  if (installation) {
    const installationId = await findInstallation(installation).then(
      (it) => it.id
    );
    conditions.push({ installation: installationId });
  }

  if (!conditions.length) {
    throw new Error("You must specify installation and/or user");
  }

  return strapi
    .query("order")
    .find({ ...query, _where: { _or: conditions } }, [
      "table",
      "table.venue",
      "table.venue.location",
    ]);
}

async function findOneOrderHistory(installation, user, id, query) {
  const conditions = [];
  if (user) {
    conditions.push({ user: get(user, "id", user) });
  }
  if (installation) {
    const installationId = await findInstallation(installation).then(
      (it) => it.id
    );
    conditions.push({ installation: installationId });
  }
  if (!conditions.length) {
    throw new Error("You must specify installation and/or user");
  }
  return strapi
    .query("order")
    .findOne({ id, ...query, _where: { _or: conditions } }, [
      "table",
      "table.venue",
      "table.venue.location",
    ]);
}

async function cancel(organization, id, reason) {
  return strapi.services.order.update(
    { organization, id },
    { canceledReason: reason, canceledAt: new Date() }
  );
}

module.exports = {
  processOrderCreateParams,
  processOrderCreateData,
  findOrderHistory,
  findOneOrderHistory,
  cancel,
};
