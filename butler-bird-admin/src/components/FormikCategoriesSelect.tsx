import { FC, memo, useCallback } from "react";
import { useField } from "formik";
import { CategoriesSelect } from "./CategoriesSelect";
import { Category } from "domain/models/Category";
import { keyBy } from "lodash";

type Props = {
  name: string;
  categories: Category[];
};

export const FormikCategoriesSelect: FC<Props> = memo(
  function FormikCategoriesSelect(props) {
    const {
      chips,
      handleValueChange,
      handleDelete,
    } = useFormikCategoriesSelect(props);

    return (
      <CategoriesSelect
        value={chips}
        onValueChange={handleValueChange}
        onDelete={handleDelete}
        {...props}
      />
    );
  }
);

function useFormikCategoriesSelect({ name, categories }: Props) {
  const [{ value }, , { setValue }] = useField<number[] | undefined>(name);

  const categoriesRecord = keyBy(categories, "id");
  const chips =
    value?.map((id) => categoriesRecord[id]).filter((id) => !!id) ?? [];

  const handleValueChange = useCallback(
    (categories: Category[]) => {
      setValue(categories.map((category) => category.id));
    },
    [setValue]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setValue(value?.filter((v) => v !== id));
    },
    [setValue, value]
  );

  return { value, setValue, chips, handleDelete, handleValueChange };
}
