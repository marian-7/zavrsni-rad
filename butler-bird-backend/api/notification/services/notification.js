"use strict";

/**
 * `notification` service.
 */
const { get } = require("lodash");

async function injectSocketIO() {
  strapi.io = require("socket.io")(strapi.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true,
    },
    allowEIO3: true,
  });
  strapi.io.of("/admin").on("connection", async (socket) => {
    const { validation } = strapi.services;
    socket.on("filter", async (filter) => {
      try {
        socket.adminParams =
          await validation.socketConnectionQuerySchema.validate(filter);
      } catch (e) {
        socket.disconnect();
      }
    });
  });
}

async function notifyAdminOrderSaved(order) {
  const orderLocation = get(order, "location.id", order.location);
  const orderVenue = get(order, "venue.id", order.venue);
  const orderTable = get(order, "table.id", order.table);
  const orderOrganization = get(order, "organization.id", order.organization);

  const sockets = await strapi.io
    .of("/admin")
    .fetchSockets()
    .then((allSockets) =>
      allSockets.filter((it) => {
        const locations = get(it, "adminParams.locations", []);
        const venues = get(it, "adminParams.venues", []);
        const tables = get(it, "adminParams.tables", []);
        const organization = get(it, "adminParams.organization");

        return (
          (orderLocation && locations.includes(orderLocation)) ||
          (orderVenue && venues.includes(orderVenue)) ||
          (orderTable && tables.includes(orderTable)) ||
          (orderOrganization && organization === orderOrganization)
        );
      })
    );

  sockets.forEach((socket) => socket.emit("order", order));
}

async function notifyOrderCanceled(order) {
  const installation = await strapi
    .query("installation")
    .findOne({ id: get(order, "installation") });
  const email = get(installation, "email");
  const title = "Your order has been canceled!";
  const message = "We are sorry for the inconvenience";
  const table = get(order, "table");
  const url = `${process.env.APP_URL}/tables/${table}?modal=OrderHistory`;
  if (email) {
    strapi.plugins["email"].services.email.send({
      to: email,
      subject: title,
      html: `<p>${message}</p><br><br><a href="${url}">${url}</a>`,
    });
  }
}

async function notifyRecipient(order) {}

async function notifySender(order) {
  const [installation, status] = await Promise.all([
    strapi.query("installation").findOne({ id: get(order, "installation") }),
    strapi.query("order-status").findOne({ id: get(order, "status") }),
  ]);

  const email = get(installation, "email");
  const table = get(order, "table");
  const url = `${process.env.APP_URL}/tables/${table}?modal=OrderHistory`;

  const title = `Your order is now ${get(status, "name[0].value")}`;
  const message = `Click here to see more`;

  if (email) {
    strapi.plugins["email"].services.email.send({
      to: email,
      subject: title,
      html: `<p>${message}</p><br><br><a href="${url}">${url}</a>`,
    });
  }
}

module.exports = {
  injectSocketIO,
  notifyAdminOrderSaved,
  notifyOrderCanceled,
  notifyRecipient,
  notifySender,
};
