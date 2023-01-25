"use strict";

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
    entities = await services["item-option"].search(ctx.query);
  } else {
    entities = await services["item-option"].find(ctx.query);
  }
  return ctx.send(
    entities.map((entity) => services.parser.mapItemOptionResponse(entity))
  );
}

async function findOne(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services["item-option"].findOne({ id, organization });
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapItemOptionResponse(entity));
}

async function create(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  services.parser.parseLabelRequest(ctx.request.body, "name");
  services.parser.parseLabelRequest(ctx.request.body, "description");

  const entity = await services["item-option"].create({
    ...ctx.request.body,
    organization,
  });

  return ctx.send(services.parser.mapItemOptionResponse(entity));
}

async function update(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;
  services.parser.parseLabelRequest(ctx.request.body, "name");
  services.parser.parseLabelRequest(ctx.request.body, "description");

  const entity = await services["item-option"].update(
    { id, organization },
    ctx.request.body
  );

  return ctx.send(services.parser.mapItemOptionResponse(entity));
}

async function remove(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services["item-option"].delete({ id, organization });
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapItemOptionResponse(entity));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
};
