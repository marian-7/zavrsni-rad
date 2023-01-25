import React, { FC, memo, MouseEvent } from "react";
import { Menu } from "domain/models/Menu";
import { Button } from "components/Button";
import itemStyle from "styles/components/PickerListItem.module.scss";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";
import { IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useLocal } from "hooks/useLocal";
import { NavLink as Link } from "react-router-dom";
import { ReactComponent as VisibilityIcon } from "assets/icons/visibility.svg";
import { getLabel } from "domain/util/text";

interface Props {
  menu: Menu;
  added: boolean;
  onClick: (menu: Menu) => void;
  viewPath: string;
}

export const MenusPickerItem: FC<Props> = memo(function MenusPickerItem(props) {
  const { handleClick, handleLinkClick } = useMenusPickerItem(props);
  const { t } = useTranslation();
  const { local } = useLocal();

  const { menu, added, viewPath } = props;

  return (
    <li>
      <Button className={itemStyle.item} onClick={handleClick}>
        <div className="flex-1">
          <Typography component="span" className={itemStyle.label}>
            {getLabel(menu.name, local)}
          </Typography>
          <div className="d-flex align-item-center">
            {added && (
              <>
                <Typography component="span" className={itemStyle.text}>
                  {t("pages.menusPicker.added")}
                </Typography>
                <div className={itemStyle.separator} />
              </>
            )}
            <Typography component="span" className={itemStyle.text}>
              {t("pages.menusPicker.contains", {
                count: menu.itemCount,
              })}
            </Typography>
          </div>
        </div>
        <IconButton component={Link} to={viewPath} onClick={handleLinkClick}>
          <VisibilityIcon className={itemStyle.primary} />
        </IconButton>
        {added ? (
          <HighlightOffIcon className={itemStyle.alert} />
        ) : (
          <AddIcon className={itemStyle.primary} />
        )}
      </Button>
    </li>
  );
});

function useMenusPickerItem({ menu, onClick }: Props) {
  function handleClick() {
    onClick(menu);
  }

  function handleLinkClick(e: MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
  }

  return { handleClick, handleLinkClick };
}
