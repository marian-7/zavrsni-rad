"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const yup = require("yup");
const validation = require("../../validation/services/validation");

const createSchema = yup
  .object({
    streetAddress: yup.string().required(),
    additionalInfo: yup.string(),
    hereId: yup.string(),
    city: yup.string().required(),
    position: validation.pinSchema.required(),
    user: validation.idSchema,
  })
  .noUnknown();

const updateSchema = yup
  .object({
    streetAddress: yup.string(),
    additionalInfo: yup.string(),
    hereId: yup.string(),
    city: yup.string(),
    position: validation.pinSchema,
  })
  .noUnknown();

async function beforeCreate(data) {
  const validated = await createSchema.validate(data);
  Object.assign(data, validated);
}

async function beforeUpdate(params, data) {
  const validated = await updateSchema.validate(data);
  Object.assign(data, validated);
}

module.exports = {
  beforeCreate,
  beforeUpdate,
};
