"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const yup = require("yup");
const validation = require("../../validation/services/validation");

const createSchema = yup.object({
  organization: validation.idRequiredSchema,
  nameLocalized: validation.label2RequiredSchema,
  descriptionLocalized: validation.label2Schema,
  longDescriptionLocalized: validation.label2Schema,
  price: yup.number().default(0),
  optionGroupsOrder: yup.array(validation.idRequiredSchema),
  optionGroups: yup.array(validation.idRequiredSchema),
  tags: yup.array(validation.idRequiredSchema),
  categories: yup.array(validation.idRequiredSchema),
});

const updateSchema = yup.object({
  nameLocalized: validation.label2Schema,
  descriptionLocalized: validation.label2Schema,
  longDescriptionLocalized: validation.label2Schema,
  price: yup.number(),
  optionGroupsOrder: yup.array(validation.idRequiredSchema),
  optionGroups: yup.array(validation.idRequiredSchema),
  tags: yup.array(validation.idRequiredSchema),
  categories: yup.array(validation.idRequiredSchema),
});

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
