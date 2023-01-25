import { FC, memo } from "react";
import { useField } from "formik";
import { TagsSelect } from "components/TagsSelect";

type Props = {
  name: string;
};

export const FormikTagsSelect: FC<Props> = memo(function FormikTagsSelect(
  props
) {
  const { field, setValue } = useFormikTagsSelect(props);

  return <TagsSelect {...field} onValueChange={setValue} />;
});

function useFormikTagsSelect({ name }: Props) {
  const [field, , { setValue }] = useField(name);

  return { field, setValue };
}
