"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const netsPay = require("./netsPay");
const paymentProviders = require("./paymentProviders");

async function getProvider(orderId) {
  const organization = await strapi.services.organization.findByOrderId(
    orderId
  );
  if (organization?.netsPay?.secretKey && organization?.netsPay?.checkoutKey) {
    return paymentProviders.netsPay;
  }
  return null;
}

async function createForOrder(orderId, provider) {
  if (!provider) {
    provider = await getProvider(orderId);
  }
  switch (provider) {
    case paymentProviders.netsPay:
      const netsPayResult = await netsPay.createPayment(orderId);
      return strapi.query("payment").create({
        provider: "netsPay",
        uid: netsPayResult.paymentId,
        status: "pending",
        order: orderId,
        snapshot: JSON.stringify(netsPayResult),
      });
    default:
      return null;
  }
}

module.exports = {
  netsPay,
  getProvider,
  createForOrder,
};
