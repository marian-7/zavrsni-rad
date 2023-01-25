"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function findOneBy({ installation, user }) {
  return strapi
    .query("feedback-system")
    .model.query((qb) => {
      if (user) {
        qb.where("user", user);
      } else {
        qb.innerJoin("installations", `installation`, "installations.id");
        qb.where("installations.id", installation);
      }
    })
    .fetch();
}

async function createOrUpdate({ user, ...params }, installation) {
  const { services } = strapi;
  let entity = await findOneBy({ user, installation: installation.id });
  if (entity) {
    entity = await services["feedback-system"].update(
      { id: entity.id },
      { ...params, installation: installation.id }
    );
  } else {
    entity = await services["feedback-system"].create({
      user,
      ...params,
      //change - instalacija je dole jer params u sebi ima instalaciju takoder ali ona je uuid
      installation: installation.id,
    });
  }
  return entity;
}

module.exports = {
  findOneBy,
  createOrUpdate,
};
