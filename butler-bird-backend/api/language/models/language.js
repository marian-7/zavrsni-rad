'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

function beforeCreate(data) {
  data.iso = data.iso.toLowerCase();
}

async function afterCreate() {
  await strapi.services.language.inject();
}

async function afterUpdate() {
  await strapi.services.language.inject();
}

module.exports = {
  lifecycles: {
    beforeCreate,
    afterCreate,
    afterUpdate,
  }
};
