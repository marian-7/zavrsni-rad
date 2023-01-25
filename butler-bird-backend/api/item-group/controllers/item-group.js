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
    entities = await services["item-group"].search(ctx.query);
  } else {
    entities = await services["item-group"].find(ctx.query);
  }
  return ctx.send(
    entities.map((entity) => services.parser.mapItemGroupResponse(entity))
  );
}

async function findOne(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services["item-group"].findOne({ id, organization });
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapItemGroupResponse(entity));
}

async function create(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  services.parser.parseLabelRequest(ctx.request.body, "name");
  services.parser.parseLabelRequest(ctx.request.body, "description");
  services.parser.parseOrderedRequest(ctx.request.body, "options");

  const entity = await services["item-group"].create({
    ...ctx.request.body,
    organization,
  });

  return ctx.send(services.parser.mapItemGroupResponse(entity));
}

async function update(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;
  services.parser.parseLabelRequest(ctx.request.body, "name");
  services.parser.parseLabelRequest(ctx.request.body, "description");
  services.parser.parseOrderedRequest(ctx.request.body, "options");

  const entity = await services["item-group"].update(
    { id, organization },
    ctx.request.body
  );

  return ctx.send(services.parser.mapItemGroupResponse(entity));
}

async function remove(ctx) {
  const { services } = strapi;
  const { organization } = ctx.request.header;
  const { id } = ctx.params;

  const entity = await services["item-group"].delete({ id, organization });
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapItemGroupResponse(entity));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
};
