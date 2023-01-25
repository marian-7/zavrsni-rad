'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function find(ctx) {
  const {services} = strapi;
  let entities;
  if (ctx.query._q) {
    entities = await services.currency.search(ctx.query);
  } else {
    entities = await services.currency.find(ctx.query);
  }
  return entities.map(entity => services.parser.mapCurrencyResponse(entity));
}

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;

  const entity = await services.currency.findOne({id});
  return services.parser.mapCurrencyResponse(entity);
}

async function findExchangeRates(ctx) {
  const {services} = strapi;
  const {iso} = ctx.params;

  const exchangeRates = await services.currency.getExchangeRates(iso);

  return ctx.send(exchangeRates);
}

module.exports = {
  find,
  findOne,
  findExchangeRates,
};
