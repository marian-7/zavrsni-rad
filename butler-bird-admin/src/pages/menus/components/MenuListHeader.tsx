import { SearchInput } from "components/SearchInput";
import React, { ChangeEvent, FC, memo, useMemo } from "react";
import { SingleSelect } from "components/SingleSelect";
import { MultipleSelect } from "components/MultipleSelect";
import { useTranslation } from "react-i18next";
import { Option } from "util/types";
import { time } from "util/time";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  locations: Option[];
  selectedLocations: number[];
  onLocationsChange: (value: number[]) => void;
  from: string;
  to: string;
  onFromChange: (from: string) => void;
  onToChange: (to: string) => void;
}

export const MenuListHeader: FC<Props> = memo(function MenuListHeader(props) {
  const {
    search,
    locations,
    selectedLocations,
    onLocationsChange,
    from,
    to,
    onFromChange,
    onToChange,
  } = props;
  const { handleSearchChange, timeOptions } = useMenuListHeader(props);
  const { t } = useTranslation();

  return (
    <div className="pv-3 ph-2">
      <MultipleSelect
        className="mb-2"
        options={locations}
        onChange={onLocationsChange}
        value={selectedLocations}
        placeholder={t("form.placeholders.allLocations")}
      />
      <div className="d-flex">
        <SingleSelect
          value={from}
          withRadioInput={false}
          onChange={onFromChange}
          options={timeOptions}
          className="mb-2 mr-1"
        />
        <SingleSelect
          value={to}
          withRadioInput={false}
          onChange={onToChange}
          options={timeOptions}
          className="mb-2"
        />
      </div>
      <SearchInput value={search} onChange={handleSearchChange} />
    </div>
  );
});

function useMenuListHeader({ onSearchChange }: Props) {
  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value ?? "");
  }

  const timeOptions = useMemo(() => {
    return time().map((time) => ({ value: time, label: time.substring(0, 5) }));
  }, []);

  return { handleSearchChange, timeOptions };
}
