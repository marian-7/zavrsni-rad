import { Page } from "components/Page";
import { categoriesService } from "domain/services/categoriesService";
import React, { FC, memo, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Switch, useParams } from "react-router-dom";
import { List } from "components/List";
import { useTranslation } from "react-i18next";
import { paths } from "paths";
import { CategoryListHeader } from "pages/categories/components/CategoryListHeader";
import { CategoryListItem } from "pages/categories/components/CategoryListItem";
import { Category } from "domain/models/Category";
import { I18nextContext } from "providers/I18nextProvider";
import { menusService } from "domain/services/menusService";
import { includes } from "util/array";
import { CategoryPage } from "pages/category/CategoryPage";
import { CategoryCreatePage } from "pages/categoryCreate/CategoryCreatePage";
import { CustomRoute } from "components/CustomRoute";
import { mapData } from "domain/util/axios";
import { getLabel } from "domain/util/text";

interface Props {}

const CategoriesPage: FC<Props> = memo(function CategoriesPage() {
  const {
    addNewTo,
    selectedMenus,
    setSelectedMenus,
    filteredCategories,
    search,
    setSearch,
    menuOptions,
  } = useCategoriesPage();
  const { t } = useTranslation();

  function renderItem(category: Category) {
    return <CategoryListItem key={category.id} category={category} />;
  }

  return (
    <Page>
      <List
        title={t("pages.categories.title")}
        addNewTo={addNewTo}
        listHeader={
          <CategoryListHeader
            selected={selectedMenus}
            onSelectChange={setSelectedMenus}
            selectOptions={menuOptions}
            search={search}
            onSearchChange={setSearch}
          />
        }
      >
        {filteredCategories?.map(renderItem)}
      </List>
      <Switch>
        <CustomRoute type="protected" path={paths.categoryCreate()}>
          <CategoryCreatePage />
        </CustomRoute>
        <CustomRoute type="protected" path={paths.category()}>
          <CategoryPage />
        </CustomRoute>
      </Switch>
    </Page>
  );
});

function useCategoriesPage() {
  const { lng } = useContext(I18nextContext);
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useQuery("categories", () => {
    return categoriesService.getCategories().then(mapData);
  });
  const { data: menus } = useQuery("menus", () => {
    return menusService.getMenus().then(({ data }) => data);
  });
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const addNewTo = paths.categoryCreate(slug);

  const filteredCategories = categories?.filter((category) => {
    if (selectedMenus.length > 0 && !includes(selectedMenus, category.menus)) {
      return false;
    }
    const name = getLabel(category.name, lng);
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const menuOptions = useMemo(() => {
    return (
      menus?.map((menu) => ({
        value: menu.id,
        label: menu.name[lng],
      })) ?? []
    );
  }, [lng, menus]);

  return {
    addNewTo,
    selectedMenus,
    setSelectedMenus,
    slug,
    filteredCategories,
    search,
    setSearch,
    menuOptions,
  };
}

export default CategoriesPage;
