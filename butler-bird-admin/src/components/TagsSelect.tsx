import { FC, memo, useCallback } from "react";
import { Tag } from "domain/models/Tag";
import { ItemChip } from "./ItemChip";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";

type Props = {
  value: Tag[];
  onValueChange: (value: Tag[]) => void;
};

export const TagsSelect: FC<Props> = memo(function AllergensSelect(props) {
  const { value } = props;
  const { handleDelete, local } = useTagsSelect(props);

  function renderTag() {
    return function (allergen: Tag) {
      return (
        <ItemChip
          key={allergen.id}
          id={allergen.id}
          onDelete={handleDelete}
          title={getLabel(allergen.name, local)}
        />
      );
    };
  }

  return <>{value?.length > 0 && value.map(renderTag())}</>;
});

function useTagsSelect({ value, onValueChange }: Props) {
  const { local } = useLocal();

  const handleDelete = useCallback(
    (id: number) => {
      const newValue = value.filter((tag) => tag.id !== id);
      onValueChange(newValue);
    },
    [onValueChange, value]
  );

  return { handleDelete, local };
}
