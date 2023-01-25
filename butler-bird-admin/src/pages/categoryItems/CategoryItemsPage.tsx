import React, { FC, memo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { itemsService } from "domain/services/itemsService";
import { mapData } from "domain/util/axios";
import { toNumber } from "lodash";
import { SidePage } from "components/SidePage";
import { ItemPickerListItem } from "pages/itemsPicker/components/ItemPickerListItem";
import { Item } from "domain/models/Item";
import { useOrganization } from "hooks/useOrganization";
import { Organization } from "domain/models/Organization";
import { categoriesService } from "domain/services/categoriesService";
import { paths } from "paths";
import { Category } from "domain/models/Category";
import { useUrlQuery } from "hooks/useUrlQuery";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";

interface Props {}

export const CategoryItemsPage: FC<Props> = memo(function CategoryItemsPage() {
  const {
    categoryItems,
    organization,
    category,
    to,
    rootTo,
    local,
  } = useCategoryItemsPage();

  function renderItem(organization: Organization) {
    return function (item: Item) {
      return (
        <ItemPickerListItem
          viewOnly={true}
          key={item.id}
          item={item}
          organization={organization}
        />
      );
    };
  }

  return (
    <SidePage
      title={category?.name ? getLabel(category.name, local) : ""}
      to={to}
      rootTo={rootTo}
    >
      {organization && categoryItems?.map(renderItem(organization))}
    </SidePage>
  );
});

function useCategoryItemsPage() {
  const { local } = useLocal();
  const query = useUrlQuery();
  const qc = useQueryClient();
  const { category: id, menu, slug } = useParams<{
    category: string;
    slug: string;
    menu?: string;
  }>();
  const organization = useOrganization();
  const { data: category } = useQuery(
    ["categories", id],
    ({ queryKey }) => {
      const [, category] = queryKey;
      return categoriesService.getCategory(category).then(mapData);
    },
    {
      placeholderData: () => {
        const categoryId = toNumber(id);
        return qc
          .getQueryData<Category[] | undefined>("categories")
          ?.find((category) => category.id === categoryId);
      },
    }
  );
  const { data: items } = useQuery("items", () => {
    return itemsService.getItems().then(mapData);
  });

  const categoryItems = items?.filter((item) => {
    const categoryId = toNumber(id);
    const index = item.categories.findIndex(
      (category) => category === categoryId
    );
    return index !== -1;
  });

  const to = (() => {
    const skipCategories = query["skip-categories"] === true;
    if (skipCategories) {
      return menu ? paths.menu(menu, slug) : paths.menuCreate(slug);
    }
    return menu
      ? paths.categoriesPicker(menu, slug)
      : paths.createCategoriesPicker(slug);
  })();

  const rootTo = menu ? paths.menu(menu, slug) : paths.menuCreate(slug);

  return { categoryItems, organization, category, to, rootTo, local };
}

export default CategoryItemsPage;
