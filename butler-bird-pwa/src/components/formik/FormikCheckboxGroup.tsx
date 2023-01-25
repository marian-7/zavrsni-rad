import React, { ChangeEvent, FC, memo, useCallback, useMemo } from "react";
import { useField } from "formik";
import { FormGroupProps, FormGroup } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { toNumber } from "lodash";

type Props = FormGroupProps & {
  name: string;
};

export const FormikCheckboxGroup: FC<Props> = memo(function FormikCheckboxGroup(props) {
  const { name, children, ...rest } = props;
  const { restField, handleChange } = useFormikCheckboxGroup(name);

  return (
    <FormGroup {...restField} onChange={handleChange} {...rest}>
      {children}
    </FormGroup>
  );
});

function useFormikCheckboxGroup(name: string) {
  const [{ onBlur, ...restField }, { error, touched }, { setValue }] = useField(name);
  const { t } = useTranslation("validations");

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      const id = e.target.value;
      const values = restField.value;
      const { index } = e.target.dataset;
      if (index && checked) {
        values[index] = { [id]: 1 };
      } else {
        values[toNumber(index)] = { [id]: 0 };
      }
      setValue(values);
    },
    [restField.value, setValue]
  );

  const err = useMemo(() => {
    if (error && touched) {
      return t(error, { defaultValue: error });
    }
  }, [error, t, touched]);

  return { err, restField, handleChange };
}
