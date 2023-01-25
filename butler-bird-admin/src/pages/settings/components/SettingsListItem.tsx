import React, { FC, memo } from "react";
import { LinkButton } from "components/LinkButton";
import classNames from "classnames";
import listItemStyle from "styles/components/ListItem.module.scss";
import style from "styles/pages/menus/components/MenuListItem.module.scss";
import { Typography } from "@material-ui/core";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";

interface Props {
  title: string;
  label: string;
  path: string;
}

export const SettingsListItem: FC<Props> = memo(function SettingsListItem(
  props
) {
  const { title, label, path } = props;
  useSettingsListItem();

  return (
    <li>
      <LinkButton
        to={path}
        className={classNames(listItemStyle.link, style.link)}
        activeClassName={listItemStyle.linkActive}
      >
        <Typography className={classNames(listItemStyle.title, style.title)}>
          {title}
        </Typography>
        <div className="d-flex align-item-center justify-content-space-between">
          <Typography className={listItemStyle.label}>{label}</Typography>
          <ArrowIcon className={classNames(listItemStyle.icon, style.icon)} />
        </div>
      </LinkButton>
    </li>
  );
});

function useSettingsListItem() {}
