'use strict';

const {parseMultipartData} = require("strapi-utils");

async function find(ctx) {
  const {services} = strapi;
  const {organization} = ctx.request.header;
  ctx.query.organization = organization;
  let entities;
  if (ctx.query._q) {
    entities = await services.table.search(ctx.query);
  } else {
    entities = await services.table.find(ctx.query);
  }
  return ctx.send(entities.map(entity => services.parser.mapTableResponse(entity)));
}

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.table.findOne({id, organization});
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapTableResponse(entity))
}

async function create(ctx) {
  const {services} = strapi;
  const {organization} = ctx.request.header;
  let params = ctx.request.body;

  if (!params.venue) {
    return ctx.throw(400, 'You must set a venue for the table!');
  }

  let multipart;
  if (ctx.is('multipart')) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  params = services.parser.mapTableRequest(params);
  params.organization = organization;

  let entity;
  if (multipart) {
    entity = await services.table.create(params, {files: multipart.files});
  } else {
    entity = await services.table.create(params);
  }
  return ctx.send(services.parser.mapTableResponse(entity));
}

async function bulkCreate(ctx) {
  const {services} = strapi;
  const {validateRequest, tableCreateBulkRequestSchema} = services.validation;
  const params = await validateRequest(ctx, tableCreateBulkRequestSchema, {
    organization: ctx.request.header.organization,
    ...ctx.request.body,
  });

  const tableParams = Array.from({length: params.amount}, (x, i) => ({
    id: x,
    organization: params.organization,
    venue: params.venue,
    label: `${params.labelTemplate} ${i + params.labelStartAt}`
  }));

  const tables = await Promise.all(tableParams.map(params => services.table.create(params)));

  return ctx.send(tables.map(it => services.parser.mapTableResponse(it)));
}

async function update(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  let params = ctx.request.body;

  let multipart;
  if (ctx.is('multipart')) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  params = services.parser.mapTableRequest(params);

  let entity;
  if (multipart) {
    entity = await services.table.update({id}, params, {files: multipart.files,});
  } else {
    entity = await services.table.update({id}, params);
  }

  return ctx.send(services.parser.mapTableResponse(entity));
}

async function remove(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;

  const entity = await services.table.delete({id});
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapTableResponse(entity));
}

module.exports = {
  find,
  findOne,
  create,
  bulkCreate,
  update,
  delete: remove,
};
