import { i18n } from "assets/strings/i18n";
import { Typography } from "domain/models/Typography";
import { FormikValues, FormikContextType } from "formik";
import { set } from "lodash";
import { AnySchema, ValidationError } from "yup";
import { ValidateOptions } from "yup/lib/types";

export function mapTranslation(
  languages: string[] | undefined,
  data: Typography = {}
) {
  return (
    languages?.reduce<Typography>((value, language) => {
      value[language] = data?.[language] ?? "";
      return value;
    }, {}) ?? {}
  );
}

export function generateID(array: any[] | undefined) {
  const currentIds = array?.map((item) => item.id) ?? [];
  return currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;
}

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

export function validate(schema: AnySchema, options?: ValidateOptions) {
  return function (values: FormikValues) {
    return getValidationErrors(schema, values, options);
  };
}

export function getTypographyError(
  context: FormikContextType<any>,
  name: string
) {
  const { getFieldMeta, submitCount } = context;
  const { error, touched } = getFieldMeta(name);

  let value: string | undefined;
  if ((touched || submitCount > 0) && error) {
    value = Object.values(
      (error as unknown) as Record<string, string | undefined>
    )[0];
  }
  if (value) {
    return i18n.t(value);
  }
}
