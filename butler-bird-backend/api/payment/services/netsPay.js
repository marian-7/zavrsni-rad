const axios = require("axios");
const { sumBy, get } = require("lodash");

const paramsQuery = `
  SELECT orders."itemsSnapshot", orders."currencySnapshot", orders."amount", orders."table", languages."iso", components_payment_nets_pay_configurations."secretKey"
  FROM orders
  INNER JOIN organizations  ON organizations."id"  = orders."organization"
  INNER JOIN organizations__languages ON organizations__languages."organization_id" = organizations."id"
  INNER JOIN languages  ON languages."id" = organizations__languages."language_id"
  INNER JOIN organizations_components  ON organizations_components."organization_id" = organizations."id"
  INNER JOIN components_payment_nets_pay_configurations  ON components_payment_nets_pay_configurations."id" = organizations_components."component_id"
  WHERE organizations_components."component_type"='components_payment_nets_pay_configurations' AND orders."id" = ?
  LIMIT 1
`;

const api = axios.create({
  baseURL: process.env.NETS_PAY_API,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function parseLabel(labelObj, language) {
  return get(labelObj, language, get(labelObj, "en", "Unknown"));
}

function constructItemName(item, language) {
  if (item.optionGroups?.length) {
    const optionGroups = item.optionGroups.map((group) => {
      const options = get(group, "options", []).map(
        (option) =>
          `${option.amount ? `x${option.amount} ` : ""}${parseLabel(
            option.name,
            language
          )}`
      );

      return `${parseLabel(group.name)} (${options.join(", ")})`;
    });

    return `${parseLabel(item.name, language)} - ${optionGroups.join("; ")}`;
  }
  return parseLabel(item.name, language);
}

function calculateTotalPrice(item) {
  let price = (item.amount || 1) * item.price;
  item.optionGroups?.forEach((group) => {
    group.options?.forEach((option) => {
      price += (option.amount || 1) * option.price;
    });
  });
  return price;
}

function buildCheckoutParams(tableId) {
  return {
    integrationType: "EmbeddedCheckout",
    url: `${process.env.APP_URL}/table/${tableId}/payment`,
    termsUrl: `${process.env.TOC_URL}`,
  };
}

async function buildCreatePaymentParams(
  secretKey,
  id,
  itemsSnapshot,
  amount,
  currencySnapshot,
  language,
  table
) {
  const items = itemsSnapshot?.map((it) => {
    const totalPrice = Math.round(calculateTotalPrice(it) * 100);
    return {
      reference: `${it.id}`,
      name: constructItemName(it, language),
      quantity: it.amount || 1,
      unit: "items",
      unitPrice: Math.round(it.price * 100),
      grossTotalAmount: totalPrice,
      netTotalAmount: totalPrice,
    };
  });

  return {
    checkout: buildCheckoutParams(table),
    order: {
      items,
      amount: Math.round(amount * 100),
      currency: currencySnapshot,
      reference: `${id}`,
    },
    notifications: buildNotificationsParams(secretKey),
  };
}

function buildNotificationsParams(key) {
  return {
    webhooks: [
      {
        eventName: "payment.created",
        url: `${process.env.API_URL}/payments/netspay/hooks/payment-created`,
        authorization: key,
      },
      {
        eventName: "payment.reservation.created.v2",
        url: `${process.env.API_URL}/payments/netspay/hooks/reservation-created`,
        authorization: key,
      },
      {
        eventName: "payment.checkout.completed",
        url: `${process.env.API_URL}/payments/netspay/hooks/checkout-completed`,
        authorization: key,
      },
      {
        eventName: "payment.charge.created.v2",
        url: `${process.env.API_URL}/payments/netspay/hooks/charge-created`,
        authorization: key,
      },
      {
        eventName: "payment.charge.failed",
        url: `${process.env.API_URL}/payments/netspay/hooks/charge-failed`,
        authorization: key,
      },
      {
        eventName: "payment.refund.initiated.v2",
        url: `${process.env.API_URL}/payments/netspay/hooks/refund-initiated`,
        authorization: key,
      },
      {
        eventName: "payment.refund.failed",
        url: `${process.env.API_URL}/payments/netspay/hooks/refund-failed`,
        authorization: key,
      },
      {
        eventName: "payment.refund.completed",
        url: `${process.env.API_URL}/payments/netspay/hooks/refund-completed`,
        authorization: key,
      },
      {
        eventName: "payment.cancel.created",
        url: `${process.env.API_URL}/payments/netspay/hooks/reservation-canceled`,
        authorization: key,
      },
      {
        eventName: "payment.cancel.failed",
        url: `${process.env.API_URL}/payments/netspay/hooks/cancellation-failed`,
        authorization: key,
      },
    ],
  };
}

async function getParams(orderId) {
  const knex = strapi.connections.default;

  const result = await knex.raw(paramsQuery, [orderId]);

  const params = get(result, "rows[0]");

  return {
    itemsSnapshot: JSON.parse(params.itemsSnapshot),
    currencySnapshot: params.currencySnapshot,
    amount: params.amount,
    language: params.iso,
    secretKey: params.secretKey,
    table: params.table,
  };
}

async function createPayment(orderId) {
  const {
    language,
    secretKey,
    itemsSnapshot,
    currencySnapshot,
    amount,
    table,
  } = await getParams(orderId);

  const request = await buildCreatePaymentParams(
    secretKey,
    orderId,
    itemsSnapshot,
    amount,
    currencySnapshot,
    language,
    table
  );

  return await api
    .post("/v1/payments", request, {
      headers: {
        Authorization: secretKey,
      },
    })
    .then((it) => it?.data)
    .catch((e) => {
      throw e?.response?.data?.errors ?? e?.response?.data ?? e;
    });
}

async function findCredentials(organizationId) {
  const results = await strapi
    .query("organization")
    .findOne({ id: organizationId }, []);

  return results.netsPay;
}

module.exports = {
  createPayment,
  findCredentials,
};
