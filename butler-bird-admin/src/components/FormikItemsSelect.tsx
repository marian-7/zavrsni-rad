import { FC, memo, useCallback } from "react";
import { useField } from "formik";
import { ItemsSelect } from "components/ItemsSelect";
import { Item } from "domain/models/Item";
import { keyBy } from "lodash";

type Props = {
  name: string;
  items: Item[];
};

export const FormikItemsSelect: FC<Props> = memo(function FormikItemsSelect(
  props
) {
  const { chips, handleValueChange, handleDelete } = useFormikItemsSelect(
    props
  );

  return (
    <ItemsSelect
      value={chips}
      onValueChange={handleValueChange}
      onDelete={handleDelete}
      {...props}
    />
  );
});

function useFormikItemsSelect({ name, items }: Props) {
  const [{ value }, , { setValue }] = useField<number[] | undefined>(name);

  const itemsRecord = keyBy(items, "id");
  const chips = value?.map((id) => itemsRecord[id]).filter((id) => !!id) ?? [];

  const handleValueChange = useCallback(
    (items: Item[]) => {
      setValue(items.map((item) => item.id));
    },
    [setValue]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setValue(value?.filter((v) => v !== id));
    },
    [setValue, value]
  );

  return { value, handleValueChange, chips, handleDelete };
}
