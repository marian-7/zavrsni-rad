'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const {parseMultipartData} = require('strapi-utils');

async function find(ctx) {
  const {services} = strapi;
  const {organization} = ctx.request.header;
  ctx.query.organization = organization;
  let entities;
  if (ctx.query._q) {
    entities = await services.menu.search(ctx.query);
  } else {
    entities = await services.menu.find(ctx.query, ['categories', 'categories.items', 'venues', 'venues.location', 'image', 'image.format']);
  }
  return ctx.send(entities.map(entity => services.parser.mapMenuResponse(entity)));
}

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.menu.findOne({
    id,
    organization,
  }, ['categories', 'categories.items', 'venues', 'venues.location', 'image', 'image.format']);
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapMenuResponse(entity));
}

async function create(ctx) {
  const {services} = strapi;
  const {validateRequest, menuRequestSchema} = services.validation;

  const multipart = ctx.is('multipart') ? parseMultipartData(ctx) : undefined;

  let params = await validateRequest(ctx, menuRequestSchema, {
    ...(multipart ? multipart.data : ctx.request.body),
    organization: ctx.request.header.organization,
  });

  params = services.parser.mapMenuRequest(params);

  let entity;
  if (multipart) {
    entity = await services.menu.create(params, {files: multipart.files});
  } else {
    entity = await services.menu.create(params);
  }
  entity = await services.menu.findOne({
    id: entity.id,
    organization: params.organization,
  }, ['categories', 'categories.items', 'venues', 'venues.location', 'image', 'image.format']);
  return ctx.send(services.parser.mapMenuResponse(entity));
}

async function update(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;
  const {validateRequest, menuRequestSchema} = services.validation;

  const multipart = ctx.is('multipart') ? parseMultipartData(ctx) : undefined;

  let params = await validateRequest(ctx, menuRequestSchema, multipart ? multipart.data : ctx.request.body);

  params = services.parser.mapMenuRequest(params);

  let entity;
  if (multipart) {
    entity = await services.menu.update({id, organization}, params, {files: multipart.files});
  } else {
    entity = await services.menu.update({id, organization}, params);
  }
  entity = await services.menu.findOne({
    id: entity.id,
    organization,
  }, ['categories', 'categories.items', 'venues', 'venues.location', 'image', 'image.format']);
  return ctx.send(services.parser.mapMenuResponse(entity));
}

async function remove(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const toDelete = await services.menu.findOne({
    id,
    organization,
  }, ['categories', 'categories.items', 'venues', 'venues.location', 'image', 'image.format']);
  const entity = await services.menu.delete({id, organization});
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapMenuResponse(toDelete));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
};
