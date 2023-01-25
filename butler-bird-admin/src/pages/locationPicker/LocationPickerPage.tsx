import { SidePage } from "components/SidePage";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Location } from "domain/models/Location";
import { LocationPickerItem } from "pages/locationPicker/components/LocationPickerItem";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";

interface Props {
  selected?: number;
  locations: Location[];
  onLocationClick: (location: number) => void;
  closePath: string;
}

export const LocationPickerPage: FC<Props> = memo(function LocationsPickerPage(
  props
) {
  const { selected, onLocationClick, closePath } = props;
  const { search, setSearch, filteredLocations } = useLocationsPickerPage(
    props
  );
  const { t } = useTranslation();

  function renderLocation(location: Location) {
    const isSelected = location.id === selected;
    return (
      <LocationPickerItem
        key={location.id}
        location={location}
        selected={isSelected}
        onClick={onLocationClick}
      />
    );
  }

  return (
    <SidePage
      title={t("pages.locationPicker.title")}
      to={closePath}
      search={search}
      onSearchChange={setSearch}
    >
      {filteredLocations.map(renderLocation)}
    </SidePage>
  );
});

function useLocationsPickerPage({ locations }: Props) {
  const [search, setSearch] = useState("");
  const { local } = useLocal();

  const filteredLocations = locations.filter((location) => {
    return getLabel(location.name, local)
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return { search, setSearch, filteredLocations };
}
