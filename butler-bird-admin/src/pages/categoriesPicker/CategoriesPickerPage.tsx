import { SidePage } from "components/SidePage";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { categoriesService } from "domain/services/categoriesService";
import { mapData } from "domain/util/axios";
import { Category } from "domain/models/Category";
import { CategoryPickerListItem } from "pages/categoriesPicker/components/CategoryPickerListItem";
import { useParams } from "react-router-dom";
import { paths } from "paths";
import { menusService } from "domain/services/menusService";
import { toNumber } from "lodash";
import { Menu } from "domain/models/Menu";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";

type Props = {
  selected?: Category[];
  onCategoriesChange?: (categories: number[]) => void;
  closePath?: string;
  viewOnly?: boolean;
};

export const CategoriesPickerPage: FC<Props> = memo(
  function CategoriesPickerPage(props) {
    const { selected, closePath, viewOnly, onCategoriesChange } = props;
    const {
      search,
      setSearch,
      filteredCategories,
      to,
      handleCategoryClick,
      showList,
    } = useCategoriesPickerPage(props);
    const { t } = useTranslation();

    function renderCategory() {
      return function (category: Category) {
        const isAdded =
          (selected ?? []).findIndex(
            (sCategory) => sCategory.id === category.id
          ) !== -1;

        return (
          <CategoryPickerListItem
            key={category.id}
            category={category}
            added={isAdded}
            onClick={onCategoriesChange ? handleCategoryClick : undefined}
          />
        );
      };
    }

    return (
      <SidePage
        title={t("pages.categoriesPicker.title")}
        to={closePath ?? to}
        search={viewOnly ? undefined : search}
        onSearchChange={viewOnly ? undefined : setSearch}
      >
        {showList && filteredCategories?.map(renderCategory())}
      </SidePage>
    );
  }
);

function useCategoriesPickerPage({ selected, onCategoriesChange }: Props) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const params = useParams<{ slug: string; menu?: string }>();
  const { slug } = params;
  const id = params.menu ? toNumber(params.menu) : undefined;
  const { local } = useLocal();

  const { data: categories } = useQuery("categories", ({ queryKey }) => {
    return (
      qc.getQueryData(queryKey) ??
      categoriesService.getCategories().then(mapData)
    );
  });

  const { data: menu } = useQuery(
    ["menus", id],
    ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) {
        return null;
      }
      return (
        qc.getQueryData(queryKey) ?? menusService.getMenu(id).then(mapData)
      );
    },
    {
      enabled: !!id,
      placeholderData: () => {
        return qc
          .getQueryData<Menu[] | undefined>("menus")
          ?.find((menu) => menu.id === id);
      },
    }
  );

  const filteredCategories = categories?.filter((category) => {
    return getLabel(category.name, local)
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const to = id ? paths.menu(id, slug) : paths.menuCreate(slug);

  const showList = (id && menu) || id === undefined;

  function handleCategoryClick(category: Category) {
    const added =
      selected?.findIndex((sCategory) => sCategory.id === category.id) !== -1;
    let list: Category[];
    if (added) {
      list =
        selected?.filter((sCategory) => sCategory.id !== category.id) ?? [];
    } else {
      list = selected?.concat([category]) ?? [];
    }
    const ids = list.map((category) => category.id);
    onCategoriesChange?.(ids);
  }

  return {
    search,
    setSearch,
    categories,
    to,
    filteredCategories,
    handleCategoryClick,
    showList,
  };
}

export default CategoriesPickerPage;
