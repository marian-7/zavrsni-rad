import { Button } from "@material-ui/core";
import React, { FC, memo, ReactNode } from "react";
import { NavLink as Link } from "react-router-dom";
import style from "styles/components/SidebarItem.module.scss";
import classNames from "classnames";

interface Props {
  to: string;
  label: string;
  icon: ReactNode;
  onItemClick: () => void;
}

export const SidebarItem: FC<Props> = memo(function SidebarItem({
  to,
  label,
  icon,
  onItemClick,
}) {
  useSidebarItem();

  return (
    <Button
      startIcon={icon}
      component={Link}
      to={to}
      variant="contained"
      color="default"
      className={style.container}
      activeClassName={classNames(
        "MuiButton-containedPrimary",
        style.containerActive
      )}
      disableElevation
      onClick={onItemClick}
    >
      {label}
    </Button>
  );
});

function useSidebarItem() {}
