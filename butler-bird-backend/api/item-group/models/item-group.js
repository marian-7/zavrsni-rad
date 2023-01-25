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
    nameLocalized: validation.label2RequiredSchema,
    descriptionLocalized: validation.label2Schema,
    selectionMode: yup.string().oneOf(["single", "multiple"]).required(),
    accessLevel: yup.string().oneOf(["organization", "item"]).required(),
    required: yup.boolean().default(false),
    options: yup.mixed(),
  })
  .noUnknown();

const updateSchema = yup
  .object({
    nameLocalized: validation.label2Schema,
    descriptionLocalized: validation.label2Schema,
    selectionMode: yup.string().oneOf(["single", "multiple"]),
    accessLevel: yup.string().oneOf(["organization", "item"]),
    required: yup.boolean(),
    options: yup.mixed(),
  })
  .noUnknown();

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
    beforeCreate,
    beforeUpdate,
  },
};
