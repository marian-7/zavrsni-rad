"use strict";

/**
 * `app` service.
 */

const { flattenDeep, some, get } = require("lodash");

async function getMenuDetails(menuId) {
  const { services } = strapi;
  const [menu, categoriesUnordered] = await Promise.all([
    services.menu.findOne({ id: menuId }),
    services.category.find({ menus: menuId }, ["image", "items"]),
  ]);

  const categoriesOrder = get(menu, "categoriesOrder", []);
  const categories = services.parser
    .orderIdsBy(
      categoriesUnordered.map((it) => it.id),
      categoriesOrder
    )
    .map((id) => categoriesUnordered.find((it) => it.id === id))
    .filter((it) => it);

  const itemIds = flattenDeep(
    categories.map((category) => category.items.map((it) => it.id))
  );
  const items = await services.item.find({ id_in: itemIds });
  const optionIds = flattenDeep(
    items.map((item) =>
      item.optionGroups.map(
        (optionGroup) => optionGroup.options?.map((option) => option.id) ?? []
      )
    )
  );
  const itemOptions = await services["item-option"].find({ id_in: optionIds });
  return categories.map((category) => {
    const entity = services.parser.mapCategoryResponse(category);
    const categoryItems = items.filter((it) =>
      some(it.categories, { id: category.id })
    );
    const categoryItemsOrder = get(category, "itemsOrder", []);
    const categoryItemsSorted = services.parser
      .orderIdsBy(
        categoryItems.map((it) => it.id),
        categoryItemsOrder
      )
      .map((id) => categoryItems.find((it) => it.id === id));
    return {
      ...entity,
      items: categoryItemsSorted.map((it) =>
        services.parser.mapItemResponse(it)
      ),
    };
  });
}

async function prepareForNextJSAuth() {
  const { query } = require("./nextJSAuthScript");
  const knex = strapi.connections.default;

  const hasTable = await knex.schema.hasTable("accounts");
  if (!hasTable) {
    await knex.raw(query).then();
  }
}

async function deleteInstallations(userId) {
  return strapi
    .query("installation")
    .model.query((qb) => qb.where("user", userId).del());
}

async function deleteProfile(user) {
  const userId = get(user, "id", user);
  await deleteInstallations(userId);
  return strapi.query("user", "users-permissions").delete({ id: userId });
}

module.exports = {
  getMenuDetails,
  prepareForNextJSAuth,
  deleteProfile,
};
