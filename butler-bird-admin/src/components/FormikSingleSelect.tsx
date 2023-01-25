import React, { FC, memo, useMemo } from "react";
import { SingleSelect, SingleSelectProps } from "components/SingleSelect";
import { useField, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

interface Props extends SingleSelectProps {
  name: string;
}

export const FormikSingleSelect: FC<Props> = memo(function FormikSingleSelect(
  props
) {
  const { value, setValue, errorMessage } = useFormikSingleSelect(props);

  return (
    <SingleSelect
      value={value}
      onChange={setValue}
      errorMessage={errorMessage}
      withHelperText
      {...props}
    />
  );
});

function useFormikSingleSelect({ name }: Props) {
  const [{ value }, { error, touched }, { setValue }] = useField(name);
  const { t } = useTranslation();

  const { submitCount } = useFormikContext();

  const errorMessage = useMemo(() => {
    if (!error) {
      return;
    }
    if (submitCount > 0 || touched) {
      return t(error, { defaultValue: error });
    }
  }, [error, submitCount, t, touched]);

  return { value, setValue, errorMessage };
}
