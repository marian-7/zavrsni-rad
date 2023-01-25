'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
async function beforeCreate(data) {
  const {services} = strapi;
  if (!data.carousel || !data.carousel.length) {
    const presets = await services.presets.find();
    data.carousel = presets.carousel;
  }
}

module.exports = {
  lifecycles: {
    beforeCreate,
  }
};
