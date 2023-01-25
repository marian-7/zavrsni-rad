import React, { FC, memo, useContext } from "react";
import { Menu } from "domain/models/Menu";
import { LinkButton } from "components/LinkButton";
import { paths } from "paths";
import { I18nextContext } from "providers/I18nextProvider";
import { useParams } from "react-router-dom";
import listItemStyle from "styles/components/ListItem.module.scss";
import style from "styles/pages/menus/components/MenuListItem.module.scss";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import { Typography } from "@material-ui/core";
import { getFormattedTime } from "domain/util/menu";

interface Props {
  menu: Menu;
}

export const MenuListItem: FC<Props> = memo(function MenuListItem(props) {
  const { slug } = useMenuListItem();
  const { menu } = props;
  const { t } = useTranslation();
  const { lng } = useContext(I18nextContext);

  return (
    <li>
      <LinkButton
        to={paths.menu(menu.id, slug)}
        className={classNames(listItemStyle.link, style.link)}
        activeClassName={listItemStyle.linkActive}
      >
        {menu.activeTimeStart && (
          <Typography className={listItemStyle.timeLabel}>
            {getFormattedTime(menu)}
          </Typography>
        )}
        <Typography className={classNames(listItemStyle.title, style.title)}>
          {menu.name[lng]}
        </Typography>
        <div className="d-flex align-item-center justify-content-space-between">
          <Typography className={listItemStyle.label}>
            {t("pages.menus.contains", { count: menu.itemCount })}
          </Typography>
          <ArrowIcon className={classNames(listItemStyle.icon, style.icon)} />
        </div>
      </LinkButton>
    </li>
  );
});

function useMenuListItem() {
  const { slug } = useParams<{ slug: string }>();

  return { slug };
}
