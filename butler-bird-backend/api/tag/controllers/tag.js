'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function findOne(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {validateRequest, tagFindSchema} = services.validation;
  await validateRequest(ctx, tagFindSchema, ctx.request.header);
  const {organization} = ctx.request.header;

  const entity = await services.tag.findOne({id, organization});
  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapTagResponse(entity));
}

async function find(ctx) {
  const {services} = strapi;
  const {validateRequest, tagFindSchema} = services.validation;
  const {organization, item} = await validateRequest(ctx, tagFindSchema, {
    ...ctx.request.header,
    ...ctx.query,
  });
  const entities = await services.tag.findByItemAndOrganization(item, organization);
  return ctx.send((entities || []).map(entity => services.parser.mapTagResponse(entity)));
}

async function create(ctx) {
  const {services} = strapi;
  const {validateRequest, tagRequestSchema} = services.validation;

  const params = await validateRequest(ctx, tagRequestSchema, {
    ...ctx.request.body,
    ...ctx.request.header,
  });

  const entity = await services.tag.create(params);
  return ctx.send(services.parser.mapTagResponse(entity));
}

async function update(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;
  const {validateRequest, tagRequestSchema} = services.validation;

  const {organization, ...params} = await validateRequest(ctx, tagRequestSchema, {
    ...ctx.request.body,
    ...ctx.request.header,
  });

  const entity = await services.tag.update({id, organization}, params);
  return ctx.send(services.parser.mapTagResponse(entity));
}

async function remove(ctx) {
  const {services} = strapi;
  const {id} = ctx.params;

  const entity = await services.tag.delete({id});
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapTagResponse(entity));
}

module.exports = {
  findOne,
  find,
  create,
  update,
  delete: remove,
};
