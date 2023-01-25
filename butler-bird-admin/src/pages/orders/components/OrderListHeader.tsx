import React, { FC, memo } from "react";
import { useOrganization } from "hooks/useOrganization";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";
import { SingleSelect } from "components/SingleSelect";
import { useQuery, useQueryClient } from "react-query";
import { locationsService } from "domain/services/locationsService";
import { mapData } from "domain/util/axios";
import { MultipleSelect } from "components/MultipleSelect";
import { useTranslation } from "react-i18next";
import { venuesService } from "domain/services/venuesService";
import { get, isNil, keyBy, sortBy, uniqBy } from "lodash";
import { tablesService } from "domain/services/tablesService";
import { Table } from "domain/models/Venue";
import classNames from "classnames";
import { Option, OrderType } from "util/types";
import { useOrderStatuses } from "hooks/useOrderStatuses";

interface Props {
  status?: number;
  onStatusChange?: (value: number) => void;
  locations: number[];
  locationsPlaceholder?: string;
  onLocationsChange: (values: number[]) => void;
  venues: number[];
  venuesPlaceholder?: string;
  onVenuesChange: (values: number[]) => void;
  tables: number[];
  tablesPlaceholder?: string;
  onTablesChange: (values: number[]) => void;
  type?: OrderType;
  onTypeChange?: (value: OrderType) => void;
  spacingClassName?: string;
  containerClassName?: string;
  selectClassName?: string;
  loadingPlaceholder?: string;
  omitStatus?: boolean;
}

export const OrderListHeader: FC<Props> = memo(function OrderListHeader(props) {
  const {
    onStatusChange,
    status,
    type,
    onTypeChange,
    locations: sLocations,
    venues: sVenues,
    spacingClassName,
    containerClassName,
    selectClassName,
    loadingPlaceholder,
    locationsPlaceholder,
    venuesPlaceholder,
    tablesPlaceholder,
    omitStatus = false,
  } = props;
  const {
    statuses,
    locations,
    venues,
    handleLocationsChange,
    handleVenuesChange,
    tables,
    handleTablesChange,
    tablesValues,
    selectedLocations,
    loadingLocations,
    selectedVenues,
    loadingVenues,
    loadingTables,
    types,
  } = useOrderListHeader(props);
  const { t } = useTranslation();

  return (
    <div className={spacingClassName}>
      <div className={classNames(containerClassName, "mb-2")}>
        <MultipleSelect
          className={selectClassName}
          options={locations}
          value={selectedLocations}
          onChange={handleLocationsChange}
          placeholder={
            !isNil(loadingPlaceholder) && loadingLocations
              ? loadingPlaceholder
              : locationsPlaceholder ?? t("form.placeholders.allLocations")
          }
        />
        <MultipleSelect
          disabled={sLocations.length === 0 || venues.length === 0}
          className={selectClassName}
          options={venues}
          value={selectedVenues}
          onChange={handleVenuesChange}
          placeholder={
            !isNil(loadingPlaceholder) && loadingVenues
              ? loadingPlaceholder
              : venuesPlaceholder ?? t("form.placeholders.allVenues")
          }
        />
      </div>
      <div className={classNames(containerClassName, "mb-2")}>
        <MultipleSelect
          disabled={sVenues.length === 0 || tables.length === 0}
          className={selectClassName}
          options={tables}
          value={tablesValues}
          onChange={handleTablesChange}
          placeholder={
            !isNil(loadingPlaceholder) && loadingTables
              ? loadingPlaceholder
              : tablesPlaceholder ?? t("form.placeholders.allTables")
          }
        />
        {!omitStatus && onStatusChange && (
          <SingleSelect
            className={selectClassName}
            options={statuses}
            value={status}
            onChange={onStatusChange}
          />
        )}
      </div>
      {type && (
        <SingleSelect
          className={selectClassName}
          options={types}
          value={type}
          onChange={onTypeChange}
        />
      )}
    </div>
  );
});

function useOrderListHeader({
  locations: sLocations,
  onLocationsChange,
  venues: sVenues,
  onVenuesChange,
  tables: sTables,
  onTablesChange,
}: Props) {
  const organization = useOrganization();
  const { data } = useOrderStatuses();
  const takeoutStatuses =
    data?.filter((status) => status.type === "takeout") ?? [];
  const { t } = useTranslation();
  const { local } = useLocal();
  const qc = useQueryClient();

  const {
    data: locationsData,
    isLoading: loadingLocations,
  } = useQuery("locations", () => locationsService.all().then(mapData));

  const { data: venuesData, isLoading: loadingVenues } = useQuery(
    "venues",
    () => venuesService.all().then(mapData)
  );

  const { data: tablesData, isLoading: loadingTables } = useQuery<
    Table[],
    unknown,
    Table[],
    [string, number[]]
  >(
    ["tables", sVenues],
    ({ queryKey }) => {
      const [, venues] = queryKey;
      const urlQuery = venues.map((venue) => `&venue_in=${venue}`).join("&");
      return tablesService.all(`?${urlQuery}`).then(mapData);
    },
    {
      enabled: sVenues.length !== 0,
      placeholderData: () => {
        const query = qc
          .getQueryCache()
          .findAll(["tables"])
          .find((query) => {
            const ids: number[] = get(query, "queryKey[1]", []);
            return sVenues.every((id) => ids.includes(id));
          });
        if (query?.state.data) {
          return query.state.data as Table[];
        }
      },
    }
  );

  const standardStatuses =
    organization?.orderStatuses.map(({ id, name }) => ({
      value: id,
      label: getLabel(name, local),
    })) ?? [];

  const statuses = uniqBy(
    takeoutStatuses
      .map((status) => {
        const label: string = t("other.takeout", {
          status:
            status.name.find((name) => name.language.iso === local)?.value ??
            t("other.unknown"),
        });

        return { value: status.id, label };
      })
      .concat(standardStatuses),
    "value"
  ).reverse();

  const types: Option[] = [
    { value: OrderType.All, label: t("pages.orders.allOrders") },
    { value: OrderType.Active, label: t("pages.orders.activeOrders") },
    { value: OrderType.Canceled, label: t("pages.orders.canceledOrders") },
  ];

  const locations =
    locationsData?.map(({ id, name }) => ({
      value: id,
      label: getLabel(name, local),
    })) ?? [];

  const selectedLocations = sLocations.filter(
    (sLocation) =>
      locations.findIndex((location) => location.value === sLocation) !== -1
  );

  const venues =
    venuesData
      ?.filter((venue) => sLocations.includes(venue.location))
      .map(({ id, name }) => ({
        value: id,
        label: getLabel(name, local),
      })) ?? [];

  const selectedVenues = sVenues.filter(
    (sVenue) => venues.findIndex((venue) => venue.value === sVenue) !== -1
  );

  const tables =
    tablesData?.map(({ id, label }) => ({
      value: id,
      label,
    })) ?? [];

  const tablesValues = sTables.filter(
    (id) => tables.findIndex((table) => table.value === id) !== -1
  );

  function handleLocationsChange(values: number[]) {
    onLocationsChange(sortBy(values));

    const locationRecord = keyBy(locationsData, "id");
    const venues = sVenues.filter(
      (id) => values.some((vId) => locationRecord[vId].venues.includes(id)),
      []
    );
    handleVenuesChange(venues);
  }

  function handleVenuesChange(values: number[]) {
    onVenuesChange(sortBy(values));

    const tablesRecord = keyBy(tablesData, "id");
    const tables = sTables.filter((id) => {
      const venue = tablesRecord[id].venue;
      return venue ? values.includes(venue) : false;
    });
    handleTablesChange(tables);
  }

  function handleTablesChange(values: number[]) {
    onTablesChange(sortBy(values));
  }

  return {
    statuses,
    locations,
    venues,
    handleLocationsChange,
    tables,
    handleVenuesChange,
    tablesValues,
    handleTablesChange,
    selectedLocations,
    loadingLocations,
    selectedVenues,
    loadingVenues,
    loadingTables,
    types,
  };
}
