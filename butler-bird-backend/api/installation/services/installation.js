"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const { get, isEqual, pick } = require("lodash");
const comparable = ["email", "user", "pushToken", "uid"];
const { v4: uuid } = require("uuid");

function areInstallationsEqual(installation1, installation2) {
  installation1.user = get(installation1, "user.id", installation1.user);
  installation2.user = get(installation2, "user.id", installation2.user);
  return isEqual(
    pick(installation1, comparable),
    pick(installation2, comparable)
  );
}

async function findOrCreate({ pushToken, ...params }) {
  let installation = await strapi.query("installation").findOne({ pushToken });
  if (!installation) {
    installation = await strapi
      .query("installation")
      .create({ pushToken, ...params });
  } else if (!areInstallationsEqual(installation, { pushToken, ...params })) {
    installation = await strapi
      .query("installation")
      .update({ pushToken }, { params });
  }

  return installation;
}

async function refresh(ctx) {
  const { services } = strapi;
  const { validateRequest, installationRequestCreateSchema } =
    services.validation;

  const params = await validateRequest(ctx, installationRequestCreateSchema, {
    ...ctx.request.body,
    pushToken: ctx.request.body.pushToken || ctx.request.body.installation,
    userAgent: ctx.request.header["user-agent"],
    user: ctx.state.user,
  });

  return findOrCreate(params).catch((e) => ctx.throw(400, e));
}

async function createOrUpdate({ pushToken, ...params }) {
  let installation = await strapi.query("installation").findOne({ pushToken });
  if (!installation) {
    installation = await strapi
      .query("installation")
      .create({ pushToken, ...params });
  } else if (!areInstallationsEqual(installation, { pushToken, ...params })) {
    installation = await strapi
      .query("installation")
      .update({ pushToken }, params);
  }
  return installation;
}

async function verify(ctx) {
  const { services } = strapi;
  const { validateRequest, installationRequestUpdateV2Schema } =
    services.validation;

  const { uid, ...params } = await validateRequest(
    ctx,
    installationRequestUpdateV2Schema,
    {
      ...ctx.request.body,
      userAgent: ctx.request.header["user-agent"],
      uid:
        ctx.request.body.uid ||
        ctx.request.body.pushToken ||
        ctx.request.body.installation,
      user: ctx.state.user,
    }
  );

  const installation = await strapi
    .query("installation")
    .update({ uid }, params)
    .catch((e) => ctx.throw(400, e));
  if (!installation) {
    return ctx.throw(
      404,
      new Error(`Installation with uid ${params.uid} doesn't exist`)
    );
  }
  return installation;
}

async function generateUID() {
  let uid = uuid();
  const installation = await strapi.query("installation").findOne({ uid });
  if (installation) {
    return generateUID();
  }
  return uid;
}

module.exports = {
  findOrCreate,
  refresh,

  createOrUpdate,
  generateUID,
  verify,
};
