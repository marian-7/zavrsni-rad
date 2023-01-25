import { FC, memo, useMemo } from "react";
import { useField, useFormikContext } from "formik";
import { Input, InputProps } from "components/Input";
import { useTranslation } from "react-i18next";
import { omit } from "lodash";

type Props = InputProps & {
  name: string;
  withHelperText?: boolean;
  showErrorOnTouched?: boolean;
};

export const FormikInput: FC<Props> = memo(function FormikInput(props) {
  const { field, errorMessage } = useFormikInput(props);

  return (
    <Input
      {...field}
      value={field.value ?? ""}
      errorMessage={errorMessage}
      {...omit(props, ["showErrorOnTouched"])}
    />
  );
});

function useFormikInput({ name, showErrorOnTouched }: Props) {
  const [field, { error, touched }] = useField(name);
  const { t } = useTranslation();

  const { submitCount } = useFormikContext();

  const errorMessage = useMemo(() => {
    if (!error) {
      return;
    }
    if (submitCount > 0 || (showErrorOnTouched && touched)) {
      return t(error, { defaultValue: error });
    }
  }, [error, showErrorOnTouched, submitCount, t, touched]);

  return { field, errorMessage };
}
