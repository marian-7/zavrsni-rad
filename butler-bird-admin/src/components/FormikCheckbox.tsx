import { ChangeEvent, FC, memo } from "react";
import { FormControlLabel } from "@material-ui/core";
import { Checkbox } from "components/Checkbox";
import { useField } from "formik";
import { CheckboxProps } from "@material-ui/core/Checkbox";

type Props = CheckboxProps & {
  name: string;
  label: string;
  formControlLabelClass?: string;
};

export const FormikCheckbox: FC<Props> = memo(function FormikCheckbox(props) {
  const { label, formControlLabelClass, ...rest } = props;
  const { handleChange, value } = useFormikCheckbox(props);

  return (
    <FormControlLabel
      className={formControlLabelClass}
      control={
        <Checkbox
          checked={value}
          onChange={handleChange}
          color="primary"
          {...rest}
        />
      }
      label={label}
    />
  );
});

function useFormikCheckbox({ name }: Props) {
  const [{ value }, , { setValue }] = useField(name);

  function handleChange(e: ChangeEvent<{ checked: boolean }>) {
    setValue(e.target.checked);
  }

  return { handleChange, value };
}
