import { SearchInput } from "components/SearchInput";
import React, { ChangeEvent, FC, memo } from "react";
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

export const VenueListHeader: FC<Props> = memo(function VenueListHeader(props) {
  const { search, selected, selectOptions, onSelectChange } = props;
  const { handleSearchChange } = useVenueListHeader(props);
  const { t } = useTranslation();

  return (
    <div className="pv-3 ph-2">
      <MultipleSelect
        name="venues"
        placeholder={t("form.placeholders.allVenues")}
        value={selected}
        onChange={onSelectChange}
        options={selectOptions}
        className="mb-2"
      />
      <SearchInput value={search} onChange={handleSearchChange} />
    </div>
  );
});

function useVenueListHeader({ onSearchChange }: Props) {
  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value ?? "");
  }

  return { handleSearchChange };
}
