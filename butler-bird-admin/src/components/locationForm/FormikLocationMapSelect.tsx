import { FC, memo } from "react";
import { useField } from "formik";
import { LocationMap } from "components/locationForm/LocationMap";

type Props = {
  name: string;
};

export const FormikLocationMapSelect: FC<Props> = memo(
  function FormikLocationMapSelect(props) {
    const { value, setValue } = useFormikLocationMapSelect(props);

    return <LocationMap value={value} onValueChange={setValue} />;
  }
);

function useFormikLocationMapSelect({ name }: Props) {
  const [{ value }, , { setValue }] = useField(name);

  return { value, setValue };
}
