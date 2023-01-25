'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

function beforeCreate(data) {
  data.iso = data.iso.toUpperCase();
}

async function afterCreate() {
  await strapi.services.currency.inject();
}

async function afterUpdate() {
  await strapi.services.currency.inject();
}

module.exports = {
  lifecycles: {
    beforeCreate,
    afterCreate,
    afterUpdate,
  }
};
