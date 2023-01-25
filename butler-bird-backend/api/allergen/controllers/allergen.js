'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function find(ctx) {
  const {services} = strapi;
  let entities;
  if (ctx.query._q) {
    entities = await services.allergen.search(ctx.query);
  } else {
    entities = await services.allergen.find(ctx.query);
  }
  return ctx.send(entities.map(entity => services.parser.mapAllergenResponse(entity)));
}

module.exports = {
  find,
};
