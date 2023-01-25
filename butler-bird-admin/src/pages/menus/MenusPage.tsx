import { Page } from "components/Page";
import React, { FC, memo, useContext, useState } from "react";
import { useQuery } from "react-query";
import { Switch, useParams } from "react-router-dom";
import { menusService } from "domain/services/menusService";
import { List } from "components/List";
import { useTranslation } from "react-i18next";
import { paths } from "paths";
import { CustomRoute } from "components/CustomRoute";
import { MenuCreatePage } from "pages/menuCreate/MenuCreatePage";
import { MenuPage } from "pages/menu/MenuPage";
import { MenuListHeader } from "pages/menus/components/MenuListHeader";
import { Menu } from "domain/models/Menu";
import { MenuListItem } from "pages/menus/components/MenuListItem";
import { I18nextContext } from "providers/I18nextProvider";
import { useQueryLocations } from "hooks/useQueryLocations";
import { getLabel } from "domain/util/text";
import { includes } from "util/array";
import { isTimeAfter, isTimeBefore } from "util/time";

interface Props {}

const MenusPage: FC<Props> = memo(function MenusPage() {
  const {
    addNewTo,
    filteredMenus,
    search,
    setSearch,
    locations,
    setLocations,
    locationOptions,
    from,
    setFrom,
    to,
    setTo,
  } = useMenusPage();
  const { t } = useTranslation();

  function renderMenu(menu: Menu) {
    return <MenuListItem key={menu.id} menu={menu} />;
  }

  return (
    <Page>
      <List
        title={t("pages.menus.title")}
        addNewTo={addNewTo}
        listHeader={
          <MenuListHeader
            from={from}
            onFromChange={setFrom}
            to={to}
            onToChange={setTo}
            search={search}
            onSearchChange={setSearch}
            selectedLocations={locations}
            onLocationsChange={setLocations}
            locations={locationOptions}
          />
        }
      >
        {filteredMenus?.map(renderMenu)}
      </List>
      <Switch>
        <CustomRoute type="protected" path={paths.menuCreate()}>
          <MenuCreatePage />
        </CustomRoute>
        <CustomRoute type="protected" path={paths.menu()}>
          <MenuPage />
        </CustomRoute>
      </Switch>
    </Page>
  );
});

function useMenusPage() {
  const { slug } = useParams<{ slug: string }>();
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("00:00:00");
  const [to, setTo] = useState("24:00:00");
  const [locations, setLocations] = useState<number[]>([]);
  const { lng } = useContext(I18nextContext);

  const { data: menus } = useQuery(["menus"], () => {
    return menusService.getMenus().then(({ data }) => data);
  });

  const { data: locationsData } = useQueryLocations();
  const locationOptions =
    locationsData?.map((location) => {
      return { value: location.id, label: getLabel(location.name, lng) };
    }) ?? [];

  const filteredMenus = menus?.filter((menu) => {
    if (locations.length > 0 && !includes(locations, menu.locations)) {
      return false;
    }

    const { activeTimeStart, activeTimeEnd } = menu;
    if (activeTimeStart && isTimeAfter(from, activeTimeStart)) {
      return false;
    }
    if (activeTimeEnd && isTimeBefore(to, activeTimeEnd)) {
      return false;
    }

    return getLabel(menu.name, lng)
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const addNewTo = paths.menuCreate(slug);

  return {
    addNewTo,
    filteredMenus,
    search,
    setSearch,
    locations,
    setLocations,
    locationOptions,
    from,
    setFrom,
    to,
    setTo,
  };
}

export default MenusPage;
