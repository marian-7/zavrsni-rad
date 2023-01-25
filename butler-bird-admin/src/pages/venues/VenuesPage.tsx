import React, { FC, memo, useState } from "react";
import { Page } from "components/Page";
import { useQuery } from "react-query";
import { venuesService } from "domain/services/venuesService";
import { mapData } from "domain/util/axios";
import { Venue } from "domain/models/Venue";
import { VenueListItem } from "pages/venues/components/VenueListItem";
import { List } from "components/List";
import { useTranslation } from "react-i18next";
import { VenueListHeader } from "pages/venues/components/VenueListHeader";
import { useOrganization } from "hooks/useOrganization";
import { Organization } from "domain/models/Organization";
import { locationsService } from "domain/services/locationsService";
import { keyBy } from "lodash";
import { Location } from "domain/models/Location";
import { paths, withSlug } from "paths";
import { Switch } from "react-router-dom";
import { CustomRoute } from "components/CustomRoute";
import { VenuePage } from "pages/venue/VenuePage";
import { VenueCreatePage } from "pages/venueCreate/VenueCreatePage";
import { getLabel } from "domain/util/text";

interface Props {}

const VenuesPage: FC<Props> = memo(function VenuesPage() {
  const {
    filteredVenues,
    search,
    setSearch,
    organization,
    locationsRecord,
    selectedLocations,
    setSelectedLocations,
    menuOptions,
  } = useVenuesPage();
  const { t } = useTranslation();

  function renderVenue(
    organization: Organization,
    locations: Record<string, Location>
  ) {
    return function (venue: Venue) {
      const location = locations[venue.location];
      return (
        <VenueListItem
          key={venue.id}
          venue={venue}
          organization={organization}
          location={location}
        />
      );
    };
  }

  return (
    <Page>
      <List
        title={t("pages.venues.title")}
        addNewTo={withSlug(paths.venueCreate())}
        listHeader={
          <VenueListHeader
            search={search}
            onSearchChange={setSearch}
            selected={selectedLocations}
            onSelectChange={setSelectedLocations}
            selectOptions={menuOptions}
          />
        }
      >
        {locationsRecord &&
          organization &&
          filteredVenues?.map(renderVenue(organization, locationsRecord))}
      </List>
      <Switch>
        <CustomRoute path={withSlug(paths.venueCreate(), true)}>
          <VenueCreatePage />
        </CustomRoute>
        <CustomRoute path={withSlug(paths.venue(), true)}>
          <VenuePage />
        </CustomRoute>
      </Switch>
    </Page>
  );
});

function useVenuesPage() {
  const [search, setSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const { data: venues } = useQuery("venues", () =>
    venuesService.all().then(mapData)
  );
  const { data: locationsList } = useQuery("locations", () =>
    locationsService.all().then(mapData)
  );
  const organization = useOrganization();

  const locationsRecord = locationsList
    ? keyBy(locationsList, "id")
    : undefined;

  const menuOptions =
    organization && locationsList
      ? locationsList.map((location) => ({
          value: location.id,
          label: location.name[organization.languages[0]],
        }))
      : [];

  const filteredVenues =
    organization && venues
      ? venues.filter((venue) => {
          if (
            selectedLocations.length > 0 &&
            !selectedLocations.includes(venue.location)
          ) {
            return false;
          }
          const name = getLabel(venue.name, organization.languages);
          return name.toLowerCase().includes(search.toLowerCase());
        })
      : [];

  return {
    filteredVenues,
    search,
    setSearch,
    organization,
    locationsRecord,
    selectedLocations,
    setSelectedLocations,
    menuOptions,
  };
}

export default VenuesPage;
