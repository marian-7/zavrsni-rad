"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

async function setupLocalization() {
  const { services } = strapi;
  strapi.localization = {};
  await Promise.all([services.language.inject(), services.currency.inject()]);
}

async function setupNextJSAuthTables() {
  const { services } = strapi;
  if (process.env.DEV_MODE === "TRUE") {
    await services.app.prepareForNextJSAuth();
  }
}

async function setupNotifications() {
  const { services } = strapi;
  await Promise.all([services.notification.injectSocketIO()]);
}

module.exports = async () => {
  await Promise.all([
    setupLocalization(),
    setupNextJSAuthTables(),
    setupNotifications(),
  ]);
};
