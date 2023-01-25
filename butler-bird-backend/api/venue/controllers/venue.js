'use strict';

const {parseMultipartData} = require('strapi-utils');

async function create(ctx) {
  const {services} = strapi;

  const {validateRequest, venueRequestSchema} = services.validation;

  let params = await validateRequest(ctx, venueRequestSchema, {
    ...ctx.request.body,
    organization: ctx.request.header.organization,
  });

  let multipart;
  if (ctx.is('multipart')) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  params = services.parser.mapVenueRequest(params);

  let entity;
  if (multipart) {
    entity = await services.venue.create(params, {files: multipart.files});
  } else {
    entity = await services.venue.create(params);
  }
  return ctx.send(services.parser.mapVenueResponse(entity));
}

async function update(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;
  const {validateRequest, venueRequestSchema} = services.validation;

  let params = await validateRequest(ctx, venueRequestSchema, ctx.request.body);

  let multipart;
  if (ctx.is('multipart')) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  params = services.parser.mapVenueRequest(params);

  let entity;
  if (multipart) {
    entity = await services.venue.update({id, organization}, params, {files: multipart.files});
  } else {
    entity = await services.venue.update({id, organization}, params);
  }

  return ctx.send(services.parser.mapVenueResponse(entity));
}

async function find(ctx) {
  const {services} = strapi;
  const {organization} = ctx.request.header;
  ctx.query.organization = organization;
  let entities;
  if (ctx.query._q) {
    entities = await services.venue.search(ctx.query);
  } else {
    entities = await services.venue.find(ctx.query);
  }
  return ctx.send(entities.map(entity => services.parser.mapVenueResponse(entity)));
}

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.venue.findOne({id, organization});
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapVenueResponse(entity));
}

async function remove(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;

  const entity = await services.venue.delete({id, organization});
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapVenueResponse(entity));
}

module.exports = {
  find,
  findOne,
  create,
  update,
  delete: remove,
};
