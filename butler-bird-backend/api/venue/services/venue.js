"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function getTablesForTakeoutUpdate(params, takeout) {
  const { services } = strapi;
  const venue = await strapi.query("venue").findOne(params);

  // venue is to become a takeout venue
  if (takeout && !venue.takeout) {
    const [_, table] = await Promise.all([
      services.table.deleteForVenue(venue.id),
      services.table.generateForTakeout(venue.organization, venue.id),
    ]);
    return [table.id];
  }
  // venue is not going to be takeout anymore
  else if (!takeout && venue.takeout) {
    await services.table.deleteForVenue(venue.id);
    return null;
  }
}

module.exports = {
  getTablesForTakeoutUpdate,
};
