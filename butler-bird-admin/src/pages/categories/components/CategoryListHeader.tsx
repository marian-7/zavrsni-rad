import React, { ChangeEvent, FC, memo } from "react";
import { MultipleSelect } from "components/MultipleSelect";
import style from "styles/pages/categories/components/CategoryListHeader.module.scss";
import { useTranslation } from "react-i18next";
import { SearchInput } from "components/SearchInput";
import { Option } from "util/types";

interface Props {
  selected: number[];
  selectOptions: Option[];
  onSelectChange: (value: number[]) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export const CategoryListHeader: FC<Props> = memo(function CategoryListHeader(
  props
) {
  const { selected, onSelectChange, selectOptions, search } = props;
  const { handleSearchChange } = usCategoryListHeader(props);
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <MultipleSelect
        name="menus"
        placeholder={t("form.placeholders.allMenus")}
        value={selected}
        onChange={onSelectChange}
        options={selectOptions}
        className="mb-2"
      />
      <SearchInput value={search} onChange={handleSearchChange} />
    </div>
  );
});

function usCategoryListHeader({ onSearchChange }: Props) {
  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value ?? "");
  }

  return { handleSearchChange };
}
