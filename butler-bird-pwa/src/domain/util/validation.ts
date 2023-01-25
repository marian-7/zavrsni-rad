import * as yup from "yup";
import { AnySchema, ValidationError } from "yup";
import { FormikValues } from "formik";
import { set } from "lodash";
import { ValidateOptions } from "yup/es/types";
import { OptionGroup } from "domain/types/OptionGroup";
import { Item } from "domain/types/Item";
import { MultipleOptionGroupOptions } from "components/item/ItemDialog";

export function getValidationErrors(
  schema: AnySchema,
  values: FormikValues,
  options?: ValidateOptions
) {
  const errors = {};
  try {
    schema.validateSync(values, { abortEarly: false, ...options });
  } catch (e) {
    if (e instanceof ValidationError) {
      e.inner.forEach((e) => {
        if (e.path) {
          set(errors, e.path, e.message);
        }
      });
    }
  }
  return errors;
}

export const itemSchema = yup.object({
  quantity: yup.number().integer().positive().required(),
  groups: yup.lazy((value, options) => {
    const item: Item = options.context;
    if (!item) {
      const shape = {};
      return yup.object(shape);
    }
    const shape = item.optionGroups?.reduce(
      (shape: Record<string, AnySchema>, group: OptionGroup) => {
        if (group.selectionMode === "multiple") {
          let arrSchema = yup.array().notRequired();
          if (group.required) {
            arrSchema = yup
              .array()
              .compact(function (v: MultipleOptionGroupOptions) {
                return Object.values(v).some((value) => value === 0);
              })
              .min(1)
              .required();
          }
          shape[group.id] = arrSchema;
        } else {
          const numberSchema = yup.number().required();
          if (group.required) {
            numberSchema.required();
          }
          shape[group.id] = numberSchema;
        }
        return shape;
      },
      {}
    );
    return yup.object(shape);
  }),
});

export const organizationFeedbackSchema = yup.object().shape({
  foodRating: yup.number().positive().required(),
  speedRating: yup.number().positive().required(),
  note: yup.string(),
});

export const appFeedbackSchema = yup.object().shape({
  firstUsage: yup.boolean().required(),
  preferredInteraction: yup.boolean().required(),
  rating: yup.number().required().min(1),
  note: yup.string(),
});

export const notificationPreferenceSchema = yup.object().shape({
  remember: yup.boolean(),
  notificationMethod: yup.string().required(),
});

export const emailSchema = yup.string().email().required();

export const addressSchema = yup.object().shape({
  streetAddress: yup.string().required(),
  hereId: yup.string().required(),
  city: yup.string(),
  position: yup.object().shape({
    lat: yup.number().required(),
    lng: yup.number().required(),
  }),
});

export const addressConfirmationSchema = yup.object().shape({
  address: addressSchema,
  additionalInfo: yup.string(),
});

export const selectedAddressSchema = yup.object().shape({
  selectedLocation: yup.number().required(),
});
