"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const yup = require("yup");
const validation = require("../../validation/services/validation");

const createSchema = yup
  .object({
    organization: validation.idRequiredSchema,
    price: yup.number(),
    nameLocalized: validation.label2RequiredSchema,
    descriptionLocalized: validation.label2Schema,
  })
  .noUnknown();

const updateSchema = yup
  .object({
    price: yup.number(),
    nameLocalized: validation.label2Schema,
    descriptionLocalized: validation.label2Schema,
  })
  .noUnknown();

async function beforeFind(params, populate) {
  if (!params._limit || params._limit === 100) {
    params._limit = -1;
  }
}

async function beforeCreate(data) {
  const validated = await createSchema.validate(data);
  Object.assign(validated, data);
}

async function beforeUpdate(params, data) {
  const validated = await updateSchema.validate(data);
  Object.assign(validated, data);
}

module.exports = {
  lifecycles: {
    beforeFind,
    beforeCreate,
    beforeUpdate,
  },
};
