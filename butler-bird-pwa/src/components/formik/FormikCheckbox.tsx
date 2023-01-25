import React, { FC, memo, ReactNode } from "react";
import { Checkbox } from "components/Checkbox";
import { CheckboxProps } from "@material-ui/core";
import { useField } from "formik";

type Props = CheckboxProps & {
  label: ReactNode;
  name: string;
};

export const FormikCheckbox: FC<Props> = memo(function FormikCheckbox({ name, ...props }) {
  const { field } = useFormikCheckbox(name);

  return <Checkbox {...field} checked={field.value} {...props} />;
});

function useFormikCheckbox(name: string) {
  const [field] = useField(name);

  return { field };
}
