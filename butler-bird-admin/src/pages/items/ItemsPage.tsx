import React, { FC, memo, useContext, useState } from "react";
import { Page } from "components/Page";
import { CustomRoute } from "components/CustomRoute";
import { paths, withSlug } from "paths";
import { List } from "components/List";
import { useTranslation } from "react-i18next";
import { ItemListHeader } from "pages/items/components/ItemListHeader";
import { useQuery } from "react-query";
import { itemsService } from "domain/services/itemsService";
import { mapData } from "domain/util/axios";
import { Item } from "domain/models/Item";
import { ItemListItem } from "pages/items/components/ItemListItem";
import { Organization } from "domain/models/Organization";
import { useOrganization } from "hooks/useOrganization";
import { categoriesService } from "domain/services/categoriesService";
import { I18nextContext } from "providers/I18nextProvider";
import { includes } from "util/array";
import { Switch } from "react-router-dom";
import { ItemPage } from "pages/item/ItemPage";
import { ItemCreatePage } from "pages/itemCreate/ItemCreatePage";
import { getLabel } from "domain/util/text";
import { useOptionGroups } from "hooks/useOptionGroups";

interface Props {}

const ItemsPage: FC<Props> = memo(function ItemsPage() {
  const {
    filteredItems,
    organization,
    selectOptions,
    selected,
    setSelected,
    search,
    setSearch,
  } = useItemsPage();
  const { t } = useTranslation();

  function renderItem(organization: Organization) {
    return function (item: Item) {
      return (
        <ItemListItem key={item.id} item={item} organization={organization} />
      );
    };
  }

  return (
    <Page>
      <List
        title={t("pages.items.title")}
        addNewTo={withSlug(paths.itemCreate())}
        listHeader={
          <ItemListHeader
            selectOptions={selectOptions}
            selected={selected}
            onSelectChange={setSelected}
            search={search}
            onSearchChange={setSearch}
          />
        }
      >
        {organization && filteredItems.map(renderItem(organization))}
      </List>
      <Switch>
        <CustomRoute path={withSlug(paths.itemCreate(), true)}>
          <ItemCreatePage />
        </CustomRoute>
        <CustomRoute path={withSlug(paths.item(), true)}>
          <ItemPage />
        </CustomRoute>
      </Switch>
    </Page>
  );
});

function useItemsPage() {
  const { lng } = useContext(I18nextContext);
  const organization = useOrganization();
  const { data: items } = useQuery("items", () =>
    itemsService.getItems().then(mapData)
  );
  const { data: categories } = useQuery("categories", () =>
    categoriesService.getCategories().then(mapData)
  );
  useOptionGroups();

  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const selectOptions =
    categories?.map((c) => ({
      value: c.id,
      label: c.name[lng],
    })) ?? [];

  const filteredItems =
    items?.filter((item) => {
      if (selected.length > 0 && !includes(selected, item.categories)) {
        return false;
      }
      return getLabel(item.name, lng)
        .toLowerCase()
        .includes(search.toLowerCase());
    }) ?? [];

  return {
    filteredItems,
    organization,
    selectOptions,
    selected,
    setSelected,
    search,
    setSearch,
  };
}

export default ItemsPage;
