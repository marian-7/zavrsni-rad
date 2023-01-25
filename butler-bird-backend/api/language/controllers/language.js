'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function find(ctx) {
  const {services, models} = strapi;
  let entities;
  if (ctx.query._q) {
    entities = await services.language.search(ctx.query);
  } else {
    entities = await services.language.find(ctx.query);
  }
  return entities.map(entity => services.parser.mapLanguageResponse(entity));
}

async function findOne(ctx) {
  const {services, models} = strapi;
  const {id} = ctx.params;

  const entity = await services.language.findOne({id});
  return services.parser.mapLanguageResponse(entity);
}

module.exports = {
  find,
  findOne,
};
