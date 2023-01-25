import React, { FC, memo } from "react";
import { TextArea } from "components/TextArea";
import { useField } from "formik";
import { TextFieldProps } from "@material-ui/core";

type Props = TextFieldProps & {
  name: string;
};

export const FormikTextArea: FC<Props> = memo(function FormikTextArea(props) {
  const { field } = useFormikTextArea(props.name);

  return <TextArea {...field} {...props} />;
});

function useFormikTextArea(name: string) {
  const [field] = useField(name);

  return { field };
}
