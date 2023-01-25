"use strict";

const { toNumber } = require("lodash");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function find(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  ctx.query.organization = organization;
  let entities;
  if (ctx.query._q) {
    entities = await services.printers.search(ctx.query);
  } else {
    entities = await services.printers.find(ctx.query);
  }
  return ctx.send(entities.map(services.parser.mapPrinterResponse));
}

async function findOne(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services.printers.findOne({ id, organization });
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapPrinterResponse(entity));
}

async function create(ctx) {
  const { services, db } = strapi;
  const { validateRequest, printerRequestCreateSchema } = services.validation;
  const params = await validateRequest(ctx, printerRequestCreateSchema, {
    ...ctx.request.body,
    ...ctx.request.header,
  });

  return strapi.connections.default
    .transaction(async (transacting) => {
      const entity = await db
        .query("printers")
        .create(services.parser.mapPrinterRequest(params), { transacting });

      await services.printers.printerAdd(
        params.serialNumber,
        toNumber(params.organization)
      );

      return entity;
    })
    .then((data) => ctx.send(services.parser.mapPrinterResponse(data)))
    .catch((e) => ctx.throw(400, e.message));
}

async function update(ctx) {
  const { services, db } = strapi;
  const { id } = ctx.params;
  const { validateRequest, printerRequestUpdateSchema } = services.validation;
  const { organization, ...params } = await validateRequest(
    ctx,
    printerRequestUpdateSchema,
    {
      ...ctx.request.body,
      ...ctx.request.header,
    }
  );

  return strapi.connections.default
    .transaction(async (transacting) => {
      let entity = await db.query("printers").findOne({ id, organization });
      if (!entity) {
        return;
      }
      let oldSN = entity.serialNumber;

      entity = await db
        .query("printers")
        .update(
          { id, organization },
          services.parser.mapPrinterRequest(params),
          {
            transacting,
          }
        );

      const isSNDifferent = oldSN !== params.serialNumber;
      if (isSNDifferent) {
        await services.printers.printerAdd(
          entity.serialNumber,
          toNumber(organization)
        );
        await services.printers.printerUnBind(
          params.serialNumber,
          toNumber(organization)
        );
      }

      return services.parser.mapPrinterResponse(entity);
    })
    .then((data) => (data ? ctx.send(data) : ctx.throw(404)))
    .catch((e) => ctx.throw(400, e.message));
}

async function remove(ctx) {
  const { services, db } = strapi;
  const { id } = ctx.params;
  const { organization } = ctx.request.header;

  return strapi.connections.default
    .transaction(async (transacting) => {
      const entity = await db
        .query("printers")
        .delete({ id, organization }, { transacting });
      if (entity) {
        await services.printers.printerUnBind(
          entity.serialNumber,
          toNumber(organization)
        );
        return services.parser.mapPrinterResponse(entity);
      }
    })
    .then((data) => (data ? ctx.send(data) : ctx.throw(404)))
    .catch((e) => ctx.throw(400, e.message));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
};
