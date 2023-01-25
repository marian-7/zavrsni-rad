'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function inject() {
  strapi.localization.languages = await strapi.services.language.find();
}

module.exports = {
  inject,
};
