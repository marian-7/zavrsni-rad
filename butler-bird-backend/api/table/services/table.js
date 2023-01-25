"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function deleteForVenue(venue) {
  strapi
    .query("table")
    .model.query((qb) => qb.where("venue", venue))
    .destroy();
}

async function generateForTakeout(organization, venueId) {
  const params = { organization, label: "Takeout (auto-generated)" };
  if (venueId) {
    params.venue = venueId;
  }
  return strapi.query("table").create(params);
}

module.exports = {
  deleteForVenue,
  generateForTakeout,
};
