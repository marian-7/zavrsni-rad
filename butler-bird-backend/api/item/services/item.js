"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const { groupBy } = require("lodash");

async function findItems(query, populate) {
  const { services } = strapi;
  const items = await services.item.find(query, populate);
  // todo - items option groups doesn't have options
  return items.map((it) => services.parser.mapItemResponse(it));
}

async function findOneItem(query, populate, params) {
  const { services } = strapi;
  const item = await services.item.findOne(query, populate);
  const optionGroupIds = item.optionGroups.map((og) => og.id);

  // todo - optimization (custom query)
  item.optionGroups = await services["item-group"].findWithOptions(false, {
    organization: query.organization,
    id_in: optionGroupIds,
  });

  return services.parser.mapItemResponse(item, params);
}

async function setTags(organization, item, tags) {
  const { services } = strapi;
  return services.item.update({ id: item }, { tags });
}

module.exports = {
  findItems,
  findOneItem,
  setTags,
};
