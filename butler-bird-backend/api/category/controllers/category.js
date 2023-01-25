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
    entities = await services.category.search(ctx.query, ['menus', 'items', 'image', 'image.format']);
  } else {
    entities = await services.category.find(ctx.query, ['menus', 'items', 'image', 'image.format']);
  }
  return ctx.send(entities.map(entity => services.parser.mapCategoryResponse(entity)));
}

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.category.findOne({id, organization});
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapCategoryResponse(entity));
}

async function create(ctx) {
  const {services} = strapi;
  const {validateRequest, categoryRequestSchema} = services.validation;

  const multipart = ctx.is('multipart') ? parseMultipartData(ctx) : undefined;

  let params = await validateRequest(ctx, categoryRequestSchema, {
    ...(multipart ? multipart.data : ctx.request.body),
    organization: ctx.request.header.organization,
  });

  params = services.parser.mapCategoryRequest(params);

  let entity;
  if (multipart) {
    entity = await services.category.create(params, {files: multipart.files});
  } else {
    entity = await services.category.create(params);
  }
  return ctx.send(services.parser.mapCategoryResponse(entity));
}

async function update(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;
  const {validateRequest, categoryRequestSchema} = services.validation;

  const multipart = ctx.is('multipart') ? parseMultipartData(ctx) : undefined;

  let params = await validateRequest(ctx, categoryRequestSchema, multipart ? multipart.data : ctx.request.body);

  params = services.parser.mapCategoryRequest(params);

  let entity;
  if (multipart) {
    entity = await services.category.update({id, organization}, params, {files: multipart.files});
  } else {
    entity = await services.category.update({id, organization}, params);
  }

  return ctx.send(services.parser.mapCategoryResponse(entity));
}

async function remove(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.category.delete({id, organization});
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapCategoryResponse(entity));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
};
