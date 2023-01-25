import { FC, memo } from "react";
import { useField } from "formik";
import { Input } from "./Input";
import NumberFormat, { NumberFormatValues } from "react-number-format";

type Props = {
  name: string;
  withHelperText?: boolean;
  textAlign?: string;
  allowNegative?: boolean;
};

export const FormikPriceInput: FC<Props> = memo(function FormikPriceInput(
  props
) {
  const { allowNegative = false } = props;
  const { value, handleChange } = useFormikPriceInput(props);

  return (
    <NumberFormat
      customInput={Input}
      value={value ?? ""}
      onValueChange={handleChange}
      allowNegative={allowNegative}
      {...props}
    />
  );
});

function useFormikPriceInput({ name }: Props) {
  const [{ value }, , { setValue }] = useField(name);

  function handleChange(values: NumberFormatValues) {
    setValue(values.formattedValue);
  }

  return { value, setValue, handleChange };
}
