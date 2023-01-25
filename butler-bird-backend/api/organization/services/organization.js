"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const { get } = require("lodash");

const paymentConfigurationQuery = `
    SELECT
       netspay."checkoutKey" AS "netsPayCheckoutKey", 
       netspay."secretKey" AS "netsPaySecretKey"
    FROM components_payment_nets_pay_configurations netspay
    INNER JOIN organizations_components oc ON oc.component_id = netspay.id
    WHERE oc.component_type = 'components_payment_nets_pay_configurations' AND oc.organization_id = ?
    LIMIT 1
`;

async function findByOrderId(orderId) {
  const data = await strapi
    .query("organization")
    .model.query((qb) => {
      qb.innerJoin("orders", "orders.organization", "organizations.id");
      qb.where("orders.id", orderId);
    })
    .fetch();

  return data.toJSON();
}

async function findPublicPaymentConfig(organizationId) {
  const knex = strapi.connections.default;
  const result = await knex.raw(paymentConfigurationQuery, [organizationId]);
  const data = get(result, "rows[0]");

  if (data) {
    let netsPay;
    if (data.netsPayCheckoutKey) {
      netsPay = {
        checkoutKey: data.netsPayCheckoutKey,
      };
    }
    return {
      netsPay,
    };
  }
  return null;
}

module.exports = {
  findByOrderId,
  findPublicPaymentConfig,
};
