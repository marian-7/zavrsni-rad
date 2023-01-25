import { CSSProperties, FC, memo } from "react";
import { ImagePicker } from "./ImagePicker";
import { useField } from "formik";

type Props = {
  name: string;
  label?: string;
  fitMode?: CSSProperties["objectFit"];
};

export const FormikImagePicker: FC<Props> = memo(function FormikImagePicker(
  props
) {
  const { ...rest } = props;
  const { field, setValue } = useFormikImagePicker(props);

  return <ImagePicker {...field} onValueChanged={setValue} {...rest} />;
});

function useFormikImagePicker({ name }: Props) {
  const [field, { error }, { setValue }] = useField(name);

  return { field, error, setValue };
}
