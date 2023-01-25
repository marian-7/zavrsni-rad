"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function findWithOptions(map, query, populate) {
  const { services } = strapi;
  return map
    ? await services["item-group"]
        .find(query, populate)
        .then((ogs) =>
          ogs.map((og) => services.parser.mapItemGroupResponse(og))
        )
    : await services["item-group"].find(query, populate);
}

async function findOneWithOptions(map, query, populate) {
  const { services } = strapi;
  return map
    ? await services["item-group"]
        .findOne(query, populate)
        .then((og) => services.parser.mapItemGroupResponse(og))
    : await services["item-group"].findOne(query, populate);
}

async function createOrUpdateOptionGroups(organization, groups, params) {
  if (groups) {
    const service = strapi.services["item-group"];
    const optionService = strapi.services["item-option"];
    return Promise.all(
      groups.map((group) => {
        return optionService
          .createOrUpdateOptions(organization, group.options, params)
          .then(async (options) => {
            group.options = options;
            if (group.id) {
              return service.update({ id: group.id }, group, params);
            }
            return service.create({ ...group, organization }, params);
          });
      })
    );
  }
  return groups;
}

module.exports = {
  findWithOptions,
  findOneWithOptions,
  createOrUpdateOptionGroups,
};
