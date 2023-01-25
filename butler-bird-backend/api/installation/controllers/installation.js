"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function create(ctx) {
  const { services } = strapi;
  const { validateRequest, installationRequestCreateSchema } =
    services.validation;
  const params = await validateRequest(ctx, installationRequestCreateSchema, {
    ...ctx.request.body,
    userAgent: ctx.request.header["user-agent"],
    user: ctx.state.user,
  });

  const installation = await services.installation.findOrCreate(params);

  return ctx.send(services.parser.mapInstallationResponse(installation));
}

async function createV2(ctx) {
  const { services } = strapi;

  const { validateRequest, installationRequestCreateSchema } =
    services.validation;
  const params = await validateRequest(ctx, installationRequestCreateSchema, {
    ...ctx.request.body,
    userAgent: ctx.request.header["user-agent"],
    user: ctx.state.user,
  });

  const uid = await services.installation.generateUID();

  const installation = await services.installation.create({ ...params, uid });

  return ctx.send(services.parser.mapInstallationResponse(installation));
}

async function updateV2(ctx) {
  const { services } = strapi;

  const { validateRequest, installationRequestUpdateV2Schema } =
    services.validation;
  const { uid, ...params } = await validateRequest(
    ctx,
    installationRequestUpdateV2Schema,
    {
      ...ctx.request.body,
      userAgent: ctx.request.header["user-agent"],
      user: ctx.state.user,
    }
  );

  const installation = await services.installation.update({ uid }, params);

  return ctx.send(services.parser.mapInstallationResponse(installation));
}

async function findOneV2(ctx) {
  const { services } = strapi;

  const { validateRequest, installationRequestFindV2Schema } =
    services.validation;
  const { uid } = await validateRequest(
    ctx,
    installationRequestFindV2Schema,
    ctx.query
  );

  const installation = await services.installation.findOne({ uid });

  return ctx.send(services.parser.mapInstallationResponse(installation));
}

async function remove(ctx) {
  const { services } = strapi;
  const { validateRequest, installationRequestDeleteSchema } =
    services.validation;
  const params = await validateRequest(
    ctx,
    installationRequestDeleteSchema,
    ctx.params
  );

  const entity = await services.installation.delete(params);
  if (!entity || !entity.length) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapInstallationResponse(entity));
}

async function deleteV2(ctx) {
  const { services } = strapi;
  const { validateRequest, installationRequestFindV2Schema } =
    services.validation;
  const { uid } = await validateRequest(
    ctx,
    installationRequestFindV2Schema,
    ctx.params
  );
  const entity = await services.installation.delete({ uid });
  if (!entity) {
    return ctx.throw(404);
  }
  return ctx.send(services.parser.mapInstallationResponse(entity));
}

module.exports = {
  create,
  delete: remove,

  //v2
  createV2,
  updateV2,
  findOneV2,
  deleteV2,
};
