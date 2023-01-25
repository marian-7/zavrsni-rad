"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const yup = require("yup");
const {
  idSchema,
  idRequiredSchema,
  label2Schema,
} = require("../../validation/services/validation");

const createSchema = yup.object({
  organization: idRequiredSchema,
  location: idSchema,
  menus: yup.array(idSchema),
  bannerMessage: label2Schema,
  takeout: yup.boolean().default(false),
});

const updateSchema = yup.object({
  location: idSchema,
  menus: yup.array(idSchema),
  bannerMessage: label2Schema,
  takeout: yup.boolean(),
});

async function beforeCreate(data) {
  const validated = await createSchema.validate(data);
  if (data.takeout) {
    const tableId = await strapi.services.table.generateForTakeout(
      data.organization
    ).id;
    data.tables = [tableId];
  }
  Object.assign(data, validated);
}

async function beforeUpdate(params, data) {
  const { services } = strapi;
  const validated = await updateSchema.validate(data);
  Object.assign(data, validated);
  console.log(data);
  if (typeof data.takeout === "boolean") {
    const tables = await services.venue.getTablesForTakeoutUpdate(
      params,
      data.takeout
    );
    data.tables = tables ?? data.tables ?? [];
  }
}

module.exports = {
  lifecycles: {
    beforeCreate,
    beforeUpdate,
  },
};
