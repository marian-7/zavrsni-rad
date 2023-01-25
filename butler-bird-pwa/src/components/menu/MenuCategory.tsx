import React, { FC, memo, useCallback } from "react";
import { Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { Category } from "domain/types/Category";
import { Item } from "domain/types/Item";
import { MenuItem } from "./MenuItem";
import style from "styles/components/menu/menu-category.module.scss";
import { useTranslation } from "next-i18next";
import { useMenu } from "hooks/useMenu";
import { getLabel } from "domain/util/text";

type Props = {
  category: Category;
};

export const MenuCategory: FC<Props> = memo(function MenuCategory({ category }) {
  useMenuCategory();
  const { locale } = useRouter();
  const { t } = useTranslation("menu");
  const { name, description, items, id } = category;
  const { onItemClick } = useMenu();

  const renderItem = useCallback(
    (item: Item) => {
      return <MenuItem key={item.id} item={item} onItemClick={onItemClick} />;
    },
    [onItemClick]
  );

  return (
    <div className={style.root} data-id={id.toString()}>
      <Typography className={style.name}>{getLabel(name, locale!)}</Typography>
      <Typography className={style.desc}>{getLabel(description, locale!)}</Typography>
      {items.length ? items.map(renderItem) : <Typography>{t("nothing")}</Typography>}
    </div>
  );
});

function useMenuCategory() {}
