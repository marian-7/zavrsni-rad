"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const { get } = require("lodash");
const paymentProviders = require("../../payment/services/paymentProviders");

const isCanceled = (params, result) => params.canceledAt && result.canceledAt;
const shouldNotifyRecipient = (result) =>
  !!get(result, "status.notifyRecipient");
const shouldNotifySender = (result) => !!get(result, "status.notifySender");

// todo: move to service
async function notifyCreated(result) {
  const { printers, notification, parser } = strapi.services;
  const parsedOrder = parser.mapOrderResponse(result);
  const filteredPrinters = await printers.findForOrder(parsedOrder);

  printers
    .pushContent(parsedOrder, filteredPrinters)
    .catch((e) => console.log("Failed to print", e));

  if (shouldNotifyRecipient(result)) {
    notification
      .notifyAdminOrderSaved(parsedOrder)
      //todo: log with sentry
      .catch((e) => console.log("Failed to notify order saved", e));
  }
}

async function beforeCreate(data) {
  const { orderCreateDataSchema, orderCreateCustomDataSchema } =
    strapi.services.validation;
  let createData;
  if (!data.type) {
    createData = await orderCreateDataSchema.validate(data);
  } else {
    createData = await orderCreateCustomDataSchema.validate(data);
  }

  strapi.services.order.processOrderCreateData(data, createData);
}

async function afterCreate(result, data) {
  if (!data.pauseNotification) {
    await notifyCreated(result);
  }
}

async function afterUpdate(result, params, data) {
  const { notification, parser } = strapi.services;

  const order = parser.mapOrderResponse(result);

  if (isCanceled(data, result)) {
    notification
      .notifyOrderCanceled(order)
      .catch((e) => console.log("Failed to notify order canceled", e));
  }
  if (shouldNotifyRecipient(data, result)) {
    notification
      .notifyRecipient(order)
      .catch((e) => console.log("Failed to notify recipient", e));
  }
  if (shouldNotifySender(data, result)) {
    notification
      .notifySender(order)
      .catch((e) => console.log("Failed to notify sender", e));
  }
}

module.exports = {
  lifecycles: {
    beforeCreate,
    afterCreate,
    afterUpdate,
  },
  notifyCreated,
};
