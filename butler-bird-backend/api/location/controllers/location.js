'use strict';

const {parseMultipartData} = require("strapi-utils");

async function create(ctx) {
  const {services} = strapi;
  let params = ctx.request.body;
  const {organization} = ctx.request.header;

  let multipart;
  if (ctx.is('multipart')) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  params = services.parser.mapLocationRequest(params);
  params.organization = organization;

  let entity;
  if (multipart) {
    entity = await services.location.create(params, {files: multipart.files});
  } else {
    entity = await services.location.create(params);
  }
  return ctx.send(services.parser.mapLocationResponse(entity));
}

async function update(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;
  let params = ctx.request.body;

  let multipart;
  if (ctx.is('multipart')) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  params = services.parser.mapLocationRequest(params);

  let entity;
  if (multipart) {
    entity = await services.location.update({id, organization}, params, {files: multipart.files,});
  } else {
    entity = await services.location.update({id, organization}, params);
  }

  return ctx.send(services.parser.mapLocationResponse(entity));
}

async function remove(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.location.delete({id, organization});
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapLocationResponse(entity));
}

async function find(ctx) {
  const {services} = strapi;
  const {organization} = ctx.request.header;
  ctx.query.organization = organization;
  let entities;
  if (ctx.query._q) {
    entities = await services.location.search(ctx.query);
  } else {
    entities = await services.location.find(ctx.query);
  }
  return ctx.send(entities.map(entity => services.parser.mapLocationResponse(entity)));
}

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.location.findOne({id, organization});
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapLocationResponse(entity))
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
};
