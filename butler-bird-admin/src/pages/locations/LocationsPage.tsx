import React, { FC, memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Page } from "components/Page";
import { List } from "components/List";
import { paths, withSlug } from "paths";
import { useQuery } from "react-query";
import { locationsService } from "domain/services/locationsService";
import { mapData } from "domain/util/axios";
import { getLabel } from "domain/util/text";
import { useOrganization } from "hooks/useOrganization";
import { Organization } from "domain/models/Organization";
import { LocationsListItem } from "pages/locations/components/LocationsListItem";
import { Location } from "domain/models/Location";
import { LocationsListHeader } from "pages/locations/components/LocationsListHeader";
import { CustomRoute } from "components/CustomRoute";
import { Switch } from "react-router-dom";
import { LocationPage } from "pages/location/LocationPage";
import { LocationCreatePage } from "pages/locationCreate/LocationCreatePage";

type Props = {};

export const LocationsPage: FC<Props> = memo(function LocationsPage() {
  const {
    t,
    filteredLocations,
    organization,
    search,
    setSearch,
  } = useLocationsPage();

  function renderLocation(organization: Organization) {
    return function (location: Location) {
      return (
        <LocationsListItem
          key={location.id}
          location={location}
          organization={organization}
        />
      );
    };
  }

  return (
    <Page>
      <List
        title={t("pages.locations.title")}
        addNewTo={withSlug(paths.locationCreate())}
        listHeader={
          <LocationsListHeader search={search} onSearchChange={setSearch} />
        }
      >
        {organization && filteredLocations.map(renderLocation(organization))}
      </List>
      <Switch>
        <CustomRoute path={withSlug(paths.locationCreate(), true)}>
          <LocationCreatePage />
        </CustomRoute>
        <CustomRoute path={withSlug(paths.location(), true)}>
          <LocationPage />
        </CustomRoute>
      </Switch>
    </Page>
  );
});

function useLocationsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const organization = useOrganization();

  const { data: locations } = useQuery("locations", () =>
    locationsService.all().then(mapData)
  );

  const filteredLocations = useMemo(() => {
    return organization && locations
      ? locations.filter((location) => {
          const name = getLabel(location.name, organization.languages);
          return name.toLowerCase().includes(search.toLowerCase());
        })
      : [];
  }, [locations, organization, search]);

  return { t, filteredLocations, organization, search, setSearch };
}

export default LocationsPage;
