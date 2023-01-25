import { FC, memo, useMemo } from "react";
import { useField } from "formik";
import { TimePicker, TimePickerProps } from "./TimePicker";
import { useTranslation } from "react-i18next";

type Props = Omit<TimePickerProps, "onValueChange"> & {
  name: string;
  withHelperText?: boolean;
};

export const FormikTimePicker: FC<Props> = memo(function FormikTimePicker(
  props
) {
  const { value, setValue, errorMessage } = useFormikTimePicker(props);

  return (
    <TimePicker
      value={value ?? ""}
      errorMessage={errorMessage}
      onValueChange={setValue}
      {...props}
    />
  );
});

function useFormikTimePicker({ name }: Props) {
  const { t } = useTranslation();
  const [{ value }, { error }, { setValue }] = useField(name);

  const errorMessage = useMemo(() => {
    if (error) {
      return t(error, { defaultValue: error });
    }
  }, [error, t]);

  return { value, setValue, errorMessage };
}
