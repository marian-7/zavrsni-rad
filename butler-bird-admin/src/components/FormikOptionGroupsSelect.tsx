import { FC, memo } from "react";
import { useField } from "formik";
import { OptionGroupsSelect } from "components/OptionGroupsSelect";

type Props = {
  name: string;
};

export const FormikOptionGroupsSelect: FC<Props> = memo(
  function FormikOptionGroupSelect(props) {
    const { field, setValue } = useFormikOptionGroupsSelect(props);

    return <OptionGroupsSelect {...field} onValueChange={setValue} />;
  }
);

function useFormikOptionGroupsSelect({ name }: Props) {
  const [field, , { setValue }] = useField(name);

  return { field, setValue };
}
