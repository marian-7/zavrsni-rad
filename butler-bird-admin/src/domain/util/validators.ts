import * as yup from "yup";
import { AnySchema, StringSchema } from "yup";
import dayjs from "dayjs";
import { AccessLevel, SelectionMode } from "../models/OptionGroup";

yup.setLocale({
  mixed: {
    required: "form.validation.required",
    oneOf: "form.validation.password.different",
  },
  string: {
    email: "form.validation.emailFormat",
  },
});

export const loginSchema = yup.object({
  identifier: yup.string().email().required(),
  password: yup.string().required(),
});

export const forgottenPasswordSchema = yup.object({
  email: yup.string().email().required(),
});

export const resetPasswordSchema = yup.object({
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null])
    .required(),
});

export const createTranslationSchema = (optional: boolean) => {
  return yup.lazy((value) => {
    const isUndefined = Object.values(value).every((item) => !item);
    return yup.object(
      Object.keys(value).reduce<Record<string, StringSchema>>((data, key) => {
        if (optional && isUndefined) {
          data[key] = yup.string();
        } else {
          data[key] = yup.string().required();
        }
        return data;
      }, {})
    );
  });
};

const translationSchema = yup.lazy((value) => {
  if (!value) {
    return yup.mixed();
  }
  return yup.object(
    Object.keys(value).reduce<Record<string, StringSchema>>((data, key) => {
      data[key] = yup.string().required();
      return data;
    }, {})
  );
});

export const categorySchema = yup.object({
  name: translationSchema,
  description: translationSchema,
});

export const menuSchema = yup.object({
  name: translationSchema,
  description: translationSchema,
  activeTimeStart: yup.string().nullable(),
  activeTimeEnd: yup
    .string()
    .nullable()
    .when("activeTimeStart", {
      is: (activeTimeStart: string) => !!activeTimeStart,
      then: yup
        .string()
        .nullable()
        .test("is-greater", "form.validation.timePicker", function (value) {
          const { activeTimeStart } = this.parent;
          const timeStart = dayjs(`01-01-1970 ${activeTimeStart}`);
          const timeEnd = dayjs(`01-01-1970 ${value}`);
          return timeStart.isBefore(timeEnd);
        }),
    }),
});

export const itemSchema = yup.object({
  name: createTranslationSchema(false),
  description: createTranslationSchema(true),
  longDescription: createTranslationSchema(true),
  price: yup.number().positive(),
});

export const tagSchema = yup.object({
  name: translationSchema,
});

export const modifierSchema = yup.object({
  name: createTranslationSchema(false),
  description: createTranslationSchema(true),
  selectionMode: yup
    .string()
    .oneOf([SelectionMode.Single, SelectionMode.Multiple])
    .required(),
  required: yup.boolean().required(),
  accessLevel: yup
    .string()
    .oneOf([AccessLevel.Item, AccessLevel.Organization])
    .required(),
});

export const modifierOptionSchema = yup.object({
  name: translationSchema,
  description: createTranslationSchema(true),
  price: yup.number().required(),
});

export const tableSchema = yup.object({
  label: yup.string().required(),
});

export const tablesAddSchema = yup.object({
  quantity: yup.number().integer().positive().required(),
  template: yup.string().required(),
});

export const venueSchema = yup.object({
  name: yup.lazy((value, { context }) => {
    const key = context.languages[0];
    const shape: Record<string, AnySchema> = {};
    if (key) {
      shape[key] = yup.string().required();
    }
    return yup.object(shape);
  }),
  bannerMessage: createTranslationSchema(true),
});

export const locationSchema = yup.object({
  name: translationSchema,
});

export const settingsOrganizationSchema = yup.object({
  name: yup.string().required(),
});

export const registrationSchema = yup.object({
  uid: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6, "form.validation.password.length").required(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "form.validation.password.different")
    .required(),
});

export const staffInviteSchema = yup.object({
  email: yup.string().email().required(),
});

export const printerSchema = yup.object({
  serialNumber: yup.string().required(),
  language: yup.string().required(),
});
