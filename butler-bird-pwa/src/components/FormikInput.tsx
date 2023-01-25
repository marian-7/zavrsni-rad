import React, { FC, memo, useMemo } from "react";
import { TextFieldProps } from "@material-ui/core";
import { Input } from "./Input";
import { useTranslation } from "next-i18next";
import { useField } from "formik";

type Props = TextFieldProps & {
  name: string;
};

export const FormikInput: FC<Props> = memo(function FormikInput({ name, ...rest }) {
  const { field } = useFormikInput(name);

  return <Input {...field} {...rest} />;
});

function useFormikInput(name: string) {
  const [field, { error, touched }] = useField(name);
  const { t } = useTranslation("validations");

  const err = useMemo(() => {
    if (error && touched) {
      return t(error, { defaultValue: error });
    }
  }, [error, touched, t]);

  return { err, field };
}
