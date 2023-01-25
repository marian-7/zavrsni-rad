"use strict";

const paymentProviders = require("../../payment/services/paymentProviders");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function createCommon(ctx, schema, pauseNotification = false) {
  const { services } = strapi;
  const { validateRequest } = services.validation;

  let params = await validateRequest(ctx, schema, {
    ...ctx.request.body,
    user: ctx.state.user,
  });

  params.installation = await services.installation.verify(ctx);

  const data = await services.order.processOrderCreateParams(params);
  const entity = await services.order.create({ ...data, pauseNotification });

  return services.parser.mapOrderResponse(entity);
}

async function createCustom(ctx) {
  const { orderCreateCustomRequestSchema } = strapi.services.validation;
  try {
    const order = await createCommon(ctx, orderCreateCustomRequestSchema);
    return ctx.send(order);
  } catch (e) {
    return ctx.throw(400, e);
  }
}

async function create(ctx) {
  const { validation, parser, payment } = strapi.services;
  const { orderCreateRequestSchema } = validation;
  let order;
  try {
    order = await createCommon(ctx, orderCreateRequestSchema, true);
    const paymentProvider = await payment.getProvider(order.id);

    switch (paymentProvider) {
      case paymentProviders.netsPay:
        const { order: _, ...paymentEntity } = await payment.createForOrder(
          order.id,
          paymentProvider
        );
        order.paymentPending = parser.mapPaymentResponse(paymentEntity);
        break;
      default:
        strapi.models.order.notifyCreated(order).catch(console.log);
        break;
    }
    return ctx.send(order);
  } catch (e) {
    if (order && order.id) {
      await strapi.query("order").delete({ id: order.id });
    }
    console.log(e);
    return ctx.badRequest(null, e);
  }
}

async function find(ctx) {
  const { services } = strapi;
  const { validateRequest, orderFindSchema } = services.validation;
  const query = await validateRequest(ctx, orderFindSchema, {
    ...ctx.query,
    organization: ctx.request.header.organization,
  });

  const entities = await services.order.find(query, [
    "table",
    "table.venue",
    "table.venue.location",
  ]);

  return ctx.send(
    entities.map((entity) => services.parser.mapOrderResponse(entity))
  );
}

async function findOne(ctx) {
  const { services } = strapi;
  const { validateRequest, orderFindSchema } = services.validation;
  const query = await validateRequest(ctx, orderFindSchema, {
    ...ctx.query,
    id: ctx.params.id,
    organization: ctx.request.header.organization,
  });

  const entity = await services.order.findOne(query, [
    "table",
    "table.venue",
    "table.venue.location",
  ]);

  if (!entity) {
    ctx.throw(404);
  }
  return ctx.send(services.parser.mapOrderResponse(entity));
}

async function update(ctx) {
  const { services } = strapi;
  const { validateRequest, orderUpdateStatusSchema } = services.validation;

  const { id, organization, ...params } = await validateRequest(
    ctx,
    orderUpdateStatusSchema,
    {
      ...ctx.request.body,
      id: ctx.params.id,
      organization: ctx.request.header.organization,
    }
  );

  const entity = await services.order.update({ id, organization }, params);

  return ctx.send(services.parser.mapOrderResponse(entity));
}

async function cancel(ctx) {
  const { services } = strapi;
  const { validateRequest, orderCancelSchema } = services.validation;

  const { order, organization, canceledReason } = await validateRequest(
    ctx,
    orderCancelSchema,
    {
      ...ctx.params,
      ...ctx.request.body,
      ...ctx.request.header,
    }
  );

  const entity = await services.order.cancel(
    organization,
    order,
    canceledReason
  );
  return ctx.send(services.parser.mapOrderResponse(entity));
}

module.exports = {
  find,
  findOne,
  create,
  createCustom,
  update,
  cancel,
};
