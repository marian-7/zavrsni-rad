import { ChangeEventHandler, FC, memo, useCallback, useMemo } from "react";
import { useField, useFormikContext } from "formik";
import { Input, InputProps } from "components/Input";
import { useTranslation } from "react-i18next";
import { omit } from "lodash";

type Props = InputProps & {
  name: string;
  withHelperText?: boolean;
  showErrorOnTouched?: boolean;
};

export const FormikIntegerInput: FC<Props> = memo(function FormikIntegerInput(
  props
) {
  const { field, errorMessage, handleChange } = useFormikIntegerInput(props);

  return (
    <Input
      {...field}
      inputMode="numeric"
      value={field.value ?? ""}
      errorMessage={errorMessage}
      onChange={handleChange}
      {...omit(props, ["showErrorOnTouched"])}
    />
  );
});

function useFormikIntegerInput({ name, showErrorOnTouched }: Props) {
  const [field, { error, touched }, { setValue }] = useField(name);
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

  const handleChange = useCallback<
    ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  >(
    (e) => {
      const value = e.currentTarget.value;
      const rgx = /[1-9]+[0-9]*/;
      const match = value.match(rgx);

      setValue(match?.[0] ?? "");
    },
    [setValue]
  );

  return { field, errorMessage, handleChange };
}
