'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const {parseMultipartData} = require('strapi-utils');

async function find(ctx) {
  const {services} = strapi;
  let entities;
  if (ctx.query._q) {
    entities = await services.organization.search(ctx.query);
  } else {
    entities = await services.organization.find(
        ctx.query, ['initialOrderStatus', 'carousel', 'logo', 'languages', 'orderTypes', 'orderStatuses']);
  }
  return ctx.send(entities.map(entity => services.parser.mapOrganizationResponse(entity)));
}

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {param} = ctx.query;

  let query;
  if (isNaN(id) || param === 'slug') {
    query = {slug: id};
  } else if (param === 'id') {
    query = {id};
  } else {
    query = {_where: {_or: [{id: id}, {slug: id}]}};
  }

  const entity = await services.organization.findOne(query);
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapOrganizationResponse(entity));
}

async function update(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {organization} = ctx.request.header;
  let params = ctx.request.body;

  if (organization !== id) {
    return ctx.throw(400, new Error('id must match your organization!'));
  }

  let multipart;
  if (ctx.is('multipart')) {
    multipart = parseMultipartData(ctx);
    params = multipart.data;
  }

  params = services.parser.mapOrganizationRequest(params);

  let entity;
  if (multipart) {
    entity = await services.organization.update({id}, params, {files: multipart.files});
  } else {
    entity = await services.organization.update({id}, params);
  }

  return ctx.send(services.parser.mapOrganizationResponse(entity));
}

module.exports = {
  find,
  findOne,
  update,
};
