import React, { FC, memo } from "react";
import { CustomRoute } from "components/CustomRoute";
import { paths, withSlug } from "paths";
import { TablesPage } from "pages/tables/TablesPage";
import { LocationPickerPage } from "pages/locationPicker/LocationPickerPage";
import { Switch } from "react-router-dom";
import { Table, Venue } from "domain/models/Venue";
import { Location } from "domain/models/Location";
import { MenusPickerPage } from "pages/menusPicker/MenusPickerPage";
import { Menu } from "domain/models/Menu";
import { TablesAddPage } from "pages/tablesAdd/TablesAddPage";
import CategoriesPickerPage from "pages/categoriesPicker/CategoriesPickerPage";
import { useUrlQuery } from "hooks/useUrlQuery";

interface Props {
  venue?: number;
  values: Partial<Venue>;
  locations: Location[];
  menus: Menu[];
  tables: Table[];
  onLocationClick: (location: number) => void;
  onMenusChange: (menus: number[]) => void;
  onTablesChange: (tables: Table[]) => void;
  onTablesCreate: (tables: Table[]) => void;
}

export const VenueSwitch: FC<Props> = memo(function VenueSwitch(props) {
  const {
    values,
    locations,
    menus,
    onLocationClick,
    onMenusChange,
    tables,
    onTablesCreate,
    onTablesChange,
  } = props;
  const { closePath, viewCategoriesPath, categoriesClosePath } = useVenueSwitch(
    props
  );

  return (
    <Switch>
      <CustomRoute
        path={[
          withSlug(paths.venueCreateTablesAdd(), true),
          withSlug(paths.venueTablesAdd(), true),
        ]}
      >
        <TablesAddPage
          closePath={closePath}
          onCreate={onTablesCreate}
          tables={tables}
        />
      </CustomRoute>
      <CustomRoute
        path={[
          withSlug(paths.venuesCreateTables(), true),
          withSlug(paths.tables(), true),
        ]}
      >
        <TablesPage
          tables={tables}
          closePath={closePath}
          onTablesChange={onTablesChange}
        />
      </CustomRoute>
      <CustomRoute
        path={[
          withSlug(paths.venueCreateLocationPicker(), true),
          withSlug(paths.venueLocationPicker(), true),
        ]}
      >
        <LocationPickerPage
          closePath={closePath}
          selected={values.location}
          locations={locations}
          onLocationClick={onLocationClick}
        />
      </CustomRoute>
      <CustomRoute
        path={[
          withSlug(paths.venueCategories(), true),
          withSlug(paths.venueCreateCategories(), true),
        ]}
      >
        <CategoriesPickerPage closePath={categoriesClosePath} viewOnly />
      </CustomRoute>
      <CustomRoute
        path={[
          withSlug(paths.venueCreateMenusPicker(), true),
          withSlug(paths.venueMenusPicker(), true),
        ]}
      >
        <MenusPickerPage
          menus={menus}
          selected={values.menus ?? []}
          onMenusChange={onMenusChange}
          closePath={closePath}
          viewCategoriesPath={viewCategoriesPath}
        />
      </CustomRoute>
    </Switch>
  );
});

function useVenueSwitch({ venue }: Props) {
  const query = useUrlQuery();
  const skipMenus = query["skip-menus"] === true;
  const closePath = withSlug(venue ? paths.venue(venue) : paths.venueCreate());

  const menusPath = withSlug(
    venue ? paths.venueMenusPicker(venue) : paths.venueCreateMenusPicker()
  );
  const categoriesClosePath = skipMenus ? closePath : menusPath;

  function viewCategoriesPath(menu: number) {
    return withSlug(
      venue
        ? paths.venueCategories(venue, menu)
        : paths.venueCreateCategories(menu)
    );
  }

  return { closePath, viewCategoriesPath, categoriesClosePath };
}
