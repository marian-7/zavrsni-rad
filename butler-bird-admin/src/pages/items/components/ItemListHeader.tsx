import React, { ChangeEvent, FC, memo } from "react";
import style from "styles/pages/items/components/ItemListHeader.module.scss";
import { SearchInput } from "components/SearchInput";
import { MultipleSelect } from "components/MultipleSelect";
import { useTranslation } from "react-i18next";
import { Option } from "util/types";

interface Props {
  selected: number[];
  selectOptions: Option[];
  onSelectChange: (value: number[]) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export const ItemListHeader: FC<Props> = memo(function ItemListHeader(props) {
  const { selectOptions, selected, onSelectChange, search } = props;
  const { handleSearchChange } = useItemListHeader(props);
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <MultipleSelect
        name="items"
        placeholder={t("form.placeholders.allCategories")}
        value={selected}
        onChange={onSelectChange}
        options={selectOptions}
        className="mb-2"
      />
      <SearchInput value={search} onChange={handleSearchChange} />
    </div>
  );
});

function useItemListHeader({ onSearchChange }: Props) {
  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value ?? "");
  }

  return { handleSearchChange };
}
