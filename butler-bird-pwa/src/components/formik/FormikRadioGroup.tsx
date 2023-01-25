import React, { ChangeEvent, FC, memo, useCallback, useMemo } from "react";
import { useField } from "formik";
import { RadioGroup, RadioGroupProps } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { toNumber } from "lodash";

type Props = RadioGroupProps & {
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const FormikRadioGroup: FC<Props> = memo(function FormikRadioGroup({
  name,
  children,
  onChange,
  ...rest
}) {
  const { field, handleChange } = useFormikRadioGroup(name);

  return (
    <RadioGroup
      {...field}
      value={field.value ?? null}
      onChange={onChange ?? handleChange}
      {...rest}
    >
      {children}
    </RadioGroup>
  );
});

function useFormikRadioGroup(name: string) {
  const [field, { error, touched }, { setValue }] = useField(name);
  const { t } = useTranslation("validations");

  const err = useMemo(() => {
    if (error && touched) {
      return t(error, { defaultValue: error });
    }
  }, [error, t, touched]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(toNumber(e.currentTarget.value));
    },
    [setValue]
  );

  return { err, field, handleChange };
}
