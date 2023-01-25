import React, { ChangeEvent, FC, memo, useCallback, useMemo, useState } from "react";
import { MenuContext } from "context/MenuContext";
import { Category } from "domain/types/Category";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getTags } from "domain/services/tagsService";
import { Item } from "domain/types/Item";
import { paths } from "paths";
import * as querystring from "querystring";
import { useTable } from "hooks/useTable";
import { useCategories } from "hooks/useCategories";

type Props = {};

export enum MenuModal {
  Tags = "tags",
  Item = "item",
}

export const MenuProvider: FC<Props> = memo(function MenuProvider({ children }) {
  const {
    filteredCategories,
    handleSelectedCategory,
    selectedCategory,
    filter,
    search,
    handleShowTagsModal,
    handleSearch,
    handleFilter,
    modalType,
    tags,
    handleItemClick,
    item,
    handleClose,
    path,
    bannerMessage,
  } = useMenuProvider();

  return (
    <MenuContext.Provider
      value={{
        selectedCategory,
        filter,
        search,
        tags,
        item,
        path,
        modalType,
        bannerMessage,
        onClose: handleClose,
        categoriesList: filteredCategories,
        onSelectedCategory: handleSelectedCategory,
        onShowModal: handleShowTagsModal,
        onSearch: handleSearch,
        onFilter: handleFilter,
        onItemClick: handleItemClick,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
});

function useMenuProvider() {
  const { query, locale, push } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<number[]>([]);

  const { table, bannerMessage } = useTable();

  const modalType = useMemo(() => {
    return query.modal;
  }, [query.modal]);

  const path = useMemo(() => {
    const { id, menu } = query;
    if (!Array.isArray(id) && !Array.isArray(menu)) {
      return paths.menus(id, menu);
    }
  }, [query]);

  const [item, setItem] = useState<Item | undefined>();

  const menuId = useMemo(() => {
    if (typeof query.menu === "string") {
      return query.menu;
    }
  }, [query.menu]);

  const { categories } = useCategories(menuId);

  const { data: tags } = useQuery(
    "tags",
    () => {
      if (table) {
        const { id } = table;
        return getTags(id).then((data) => data.data);
      }
    },
    { enabled: !!table }
  );

  const filteredCategories = useMemo<Category[] | undefined>(() => {
    if (categories) {
      return categories.map((category) => {
        const items = category.items.filter((item) => {
          const match = item.tags.some((tag) => {
            return filter.includes(tag);
          });
          if (match) {
            return false;
          }
          return item?.name[locale!]?.toLowerCase().includes(search?.toLowerCase());
        });
        return { ...category, items };
      });
    }
  }, [categories, filter, locale, search]);

  const handleSearch = useCallback((e: ChangeEvent<{ value: string }>) => {
    setSearch(e.target.value);
  }, []);

  const handleFilter = useCallback((values: number[]) => {
    setFilter(values);
  }, []);

  const handleSelectedCategory = useCallback((id: number) => {
    setSelectedCategory(id);
  }, []);

  const handleShowTagsModal = useCallback(() => {
    push(`${path}?${querystring.stringify({ modal: MenuModal.Tags })}`);
  }, [path, push]);

  const handleShowItemModal = useCallback(() => {
    return push(`${path}?${querystring.stringify({ modal: MenuModal.Item })}`, undefined, {
      scroll: false,
    });
  }, [path, push]);

  const handleItemClick = useCallback(
    (item: Item) => {
      setItem(item);
      handleShowItemModal();
    },
    [handleShowItemModal]
  );

  const handleClose = useCallback(() => {
    setItem(undefined);
  }, []);

  return {
    filteredCategories,
    selectedCategory,
    handleSelectedCategory,
    filter,
    search,
    handleShowTagsModal,
    handleSearch,
    handleFilter,
    modalType,
    tags,
    handleItemClick,
    item,
    handleClose,
    path,
    bannerMessage,
  };
}
