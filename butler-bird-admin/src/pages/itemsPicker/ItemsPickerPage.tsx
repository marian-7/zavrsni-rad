import { SidePage } from "components/SidePage";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { paths } from "paths";
import { useQuery, useQueryClient } from "react-query";
import { itemsService } from "domain/services/itemsService";
import { Item } from "domain/models/Item";
import { ItemPickerListItem } from "pages/itemsPicker/components/ItemPickerListItem";
import { useOrganization } from "hooks/useOrganization";
import { Organization } from "domain/models/Organization";
import { categoriesService } from "domain/services/categoriesService";
import { mapData } from "domain/util/axios";
import { keyBy, toNumber, uniq } from "lodash";
import { useField } from "formik";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";

interface Props {}

export const ItemsPickerPage: FC<Props> = memo(function ItemsPickerPage() {
  const {
    backTo,
    organization,
    handleItemClick,
    search,
    setSearch,
    filteredItems,
    showList,
    value,
  } = useItemsPickerPage();
  const { t } = useTranslation();

  function renderItem(organization: Organization) {
    return function (item: Item) {
      const isAdded = value?.findIndex((vItem) => vItem === item.id) !== -1;

      return (
        <ItemPickerListItem
          viewOnly={false}
          key={item.id}
          item={item}
          organization={organization}
          added={isAdded}
          onClick={handleItemClick}
        />
      );
    };
  }

  return (
    <SidePage
      title={t("pages.itemPicker.title")}
      to={backTo}
      search={search}
      onSearchChange={setSearch}
    >
      {showList && organization && filteredItems.map(renderItem(organization))}
    </SidePage>
  );
});

function useItemsPickerPage() {
  const { local } = useLocal();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const params = useParams<{ slug: string; id?: string }>();
  const { slug } = params;
  const id = params.id ? toNumber(params.id) : undefined;
  const organization = useOrganization();

  const { data: items } = useQuery("items", ({ queryKey }) => {
    return qc.getQueryData(queryKey) ?? itemsService.getItems().then(mapData);
  });

  const [{ value }, , { setValue }] = useField<number[]>("items");

  const { data: category } = useQuery(
    ["categories", id],
    ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) {
        return null;
      }
      return categoriesService.getCategory(id).then(mapData);
    },
    { enabled: !!id }
  );

  const backTo = id ? paths.category(id, slug) : paths.categoryCreate(slug);

  const filteredItems =
    items?.filter((item) => {
      return getLabel(item.name, local)
        .toLowerCase()
        .includes(search.toLowerCase());
    }) ?? [];

  const showList = (id && category) || id === undefined;

  function handleItemClick(item: Item) {
    const added = value.findIndex((vItem) => vItem === item.id) !== -1;
    let cItems = value;

    if (added) {
      cItems = cItems.filter((id) => id !== item.id);
    } else {
      cItems = cItems.concat([item.id]);
    }
    cItems = uniq(cItems);

    updateValue(cItems);
  }

  function updateValue(ids: number[]) {
    const record = keyBy(items, "id");
    const categoryItems = ids.map((id) => record[id].id);
    setValue(categoryItems);
  }

  return {
    backTo,
    organization,
    category,
    handleItemClick,
    search,
    setSearch,
    filteredItems,
    showList,
    value,
  };
}

export default ItemsPickerPage;
