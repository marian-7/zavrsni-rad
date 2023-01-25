"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function find(ctx) {
  const { services } = strapi;
  const { user } = ctx.state;
  ctx.query.user = user.id;
  let entities;
  if (ctx.query._q) {
    entities = await services["user-address"].search(ctx.query);
  } else {
    entities = await services["user-address"].find(ctx.query);
  }
  return ctx.send(entities.map(services.parser.mapUserAddressResponse));
}

async function findOne(ctx) {
  const { services } = strapi;
  const { user } = ctx.state;
  const { id } = ctx.params;

  const entity = await services["user-address"].findOne({ id, user: user.id });
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapUserAddressResponse(entity));
}

async function create(ctx) {
  const { services } = strapi;
  const { user } = ctx.state;
  ctx.request.body.user = user;

  const entity = await services["user-address"].create(ctx.request.body);
  return ctx.send(services.parser.mapUserAddressResponse(entity));
}

async function update(ctx) {
  const { services } = strapi;
  const { user } = ctx.state;
  const { id } = ctx.params;

  const entity = await services["user-address"].update(
    { user: user.id, id },
    ctx.request.body
  );
  return ctx.send(services.parser.mapUserAddressResponse(entity));
}

async function remove(ctx) {
  const { services } = strapi;
  const { id } = ctx.params;
  const { user } = ctx.state;

  const entity = await services["user-address"].delete({ id, user: user.id });
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapUserAddressResponse(entity));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  remove,
};
