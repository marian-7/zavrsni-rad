import { SidePage } from "components/SidePage";
import React, { FC, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "domain/models/Menu";
import { MenusPickerItem } from "pages/menusPicker/components/MenusPickerItem";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";

interface Props {
  menus: Menu[];
  selected: number[];
  onMenusChange: (menus: number[]) => void;
  closePath: string;
  viewCategoriesPath: (menu: number) => string;
}

export const MenusPickerPage: FC<Props> = memo(function MenusPickerPage(props) {
  const { selected, closePath, viewCategoriesPath } = props;
  const {
    handleMenuClick,
    search,
    setSearch,
    filteredMenus,
  } = useMenusPickerPage(props);
  const { t } = useTranslation();

  function renderMenu(menu: Menu) {
    const added = selected.includes(menu.id);
    return (
      <MenusPickerItem
        key={menu.id}
        menu={menu}
        added={added}
        onClick={handleMenuClick}
        viewPath={viewCategoriesPath(menu.id)}
      />
    );
  }

  return (
    <SidePage
      title={t("pages.menusPicker.title")}
      to={closePath}
      search={search}
      onSearchChange={setSearch}
    >
      {filteredMenus.map(renderMenu)}
    </SidePage>
  );
});

function useMenusPickerPage({ onMenusChange, selected, menus }: Props) {
  const [search, setSearch] = useState("");
  const { local } = useLocal();

  function handleMenuClick(menu: Menu) {
    const list = selected.filter((id) => id !== menu.id);
    if (list.length === selected.length) {
      onMenusChange(list.concat([menu.id]));
    } else {
      onMenusChange(list);
    }
  }

  const filteredMenus = menus.filter((menu) => {
    return getLabel(menu.name, local)
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return { handleMenuClick, search, setSearch, filteredMenus };
}
