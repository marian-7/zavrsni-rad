"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function createOrUpdateOptions(organization, options, params) {
  const service = strapi.services["item-option"];
  return Promise.all(
    options.map((option) =>
      option.id
        ? service.update({ id: option.id }, option, params)
        : service.create({ ...option, organization }, params)
    )
  );
}

module.exports = {
  createOrUpdateOptions,
};
