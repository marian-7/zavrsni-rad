'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

async function beforeCreate(data) {
  await strapi.services['user-invitation'].remove(data.email, data.organization);
}

async function afterCreate(result, data) {
  const uid = await strapi.services['user-invitation'].generateUID();
  const url = await strapi.services['user-invitation'].createUrl(result.organization.id, result.email, uid);
  strapi.services['user-invitation'].notifyAdded(result.email, url).catch(err => console.log('Failed to send email', {
    err,
    result,
    uid,
    url,
  }));
}

module.exports = {
  lifecycles: {
    beforeCreate,
    afterCreate,
  },
};
