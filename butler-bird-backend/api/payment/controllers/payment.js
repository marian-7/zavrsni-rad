"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

async function testCreate(ctx) {
  const { payment } = strapi.services;
  const { order } = ctx.request.body;

  const result = await payment.netsPay.createPayment(order);

  return ctx.send(result);
}

async function hookNetsPayPaymentCreated(ctx) {
  console.log("hookPaymentCreated", ctx);
}

async function hookNetsPayReservationCreated(ctx) {
  console.log("hookReservationCreated", ctx);
}

async function hookNetsPayCheckoutCompleted(ctx) {
  console.log("hookCheckoutCompleted", ctx);
}

async function hookNetsPayChargeCreated(ctx) {
  console.log("hookChargeCreated", ctx);
}

async function hookNetsPayChargeFailed(ctx) {
  console.log("hookChargeFailed", ctx);
}

async function hookNetsPayRefundInitiated(ctx) {
  console.log("hookRefundInitiated", ctx);
}

async function hookNetsPayRefundFailed(ctx) {
  console.log("hookRefundFailed", ctx);
}

async function hookNetsPayRefundCompleted(ctx) {
  console.log("hookRefundCompleted", ctx);
}

async function hookNetsPayReservationCanceled(ctx) {
  console.log("hookReservationCanceled", ctx);
}

async function hookNetsPayCancellationFailed(ctx) {
  console.log("hookCancellationFailed", ctx);
}

module.exports = {
  testCreate,

  hookNetsPayPaymentCreated,
  hookNetsPayReservationCreated,
  hookNetsPayCheckoutCompleted,
  hookNetsPayChargeCreated,
  hookNetsPayChargeFailed,
  hookNetsPayRefundInitiated,
  hookNetsPayRefundFailed,
  hookNetsPayRefundCompleted,
  hookNetsPayReservationCanceled,
  hookNetsPayCancellationFailed,
};
