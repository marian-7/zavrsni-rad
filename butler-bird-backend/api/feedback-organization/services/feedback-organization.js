"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

async function findOneBy({ organization, installation, user }) {
  return strapi
    .query("feedback-organization")
    .model.query((qb) => {
      qb.innerJoin("organizations", "organization", "organizations.id");
      qb.where("organizations.slug", organization);
      if (user) {
        qb.andWhere("user", user);
      } else {
        qb.innerJoin("installations", `installation`, "installations.id");
        qb.andWhere("installations.id", installation.id);
      }
    })
    .fetch();
}

async function createOrUpdate({ organization, user, ...params }, installation) {
  const { services } = strapi;
  let entity = await findOneBy({ organization, user, installation });
  if (entity) {
    entity = await services["feedback-organization"].update(
      { id: entity.id },
      { ...params, installation: installation.id }
    );
  } else {
    const [organizationEntity] = await Promise.all([
      services.organization.findOne({ id: organization }),
    ]);

    if (!organizationEntity) {
      throw new Error(`Organization ${organization} not found`);
    }

    entity = await services["feedback-organization"].create({
      user,
      ...params,
      organization: organizationEntity.id,
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
