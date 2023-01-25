import React, { FC, memo, useMemo } from "react";
import style from "styles/components/table/menu.module.scss";
import { ButtonBase, Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Menu } from "domain/types/Menu";
import { useRouter } from "next/router";
import { paths } from "paths";
import Link from "next/link";
import { getLabel } from "domain/util/text";
import { getImage, ImageFormat } from "domain/util/getImage";
import { ReactComponent as NoImage } from "assets/icons/no-image.svg";

type Props = {
  menu: Menu;
};

export const MenuListItem: FC<Props> = memo(function MenuListItem({ menu }) {
  const { href, locale } = useMenuListItem(menu);
  const { description, name, image } = menu;

  return (
    <Link href={href ?? "/"} locale={locale} passHref>
      <ButtonBase component="a" className={style.menu}>
        {image ? (
          <img className={style.image} src={getImage(image, ImageFormat.Thumbnail)} />
        ) : (
          <NoImage className={style.image} />
        )}
        <div className="flex-1">
          <Typography className={style.title}>{getLabel(name, locale!)}</Typography>
          <div className="d-flex justify-content-space-between align-items-end">
            <Typography className={style.text}>{getLabel(description, locale!)}</Typography>
            <ArrowForwardIosIcon className={style.icon} />
          </div>
        </div>
      </ButtonBase>
    </Link>
  );
});

function useMenuListItem(menu: Menu) {
  const { id } = menu;
  const { query, locale } = useRouter();

  const href = useMemo(() => {
    const { id: tableId } = query;
    if (!Array.isArray(tableId)) {
      return paths.menus(tableId, id);
    }
  }, [id, query]);

  return { href, locale };
}
