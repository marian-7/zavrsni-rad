import { Typography } from "@material-ui/core";
import React, { FC, memo, ReactElement } from "react";
import style from "styles/components/ChipsSelect.module.scss";
import { Button } from "components/Button";
import { NavLink as Link } from "react-router-dom";
import classNames from "classnames";

export interface Action {
  label: string;
  icon?: ReactElement;
  to?: string;
  onClick?: () => void;
}

export interface ChipsSelectProps {
  className?: string;
  label?: string;
  action?: Action | Action[];
}

export const ChipsSelect: FC<ChipsSelectProps> = memo(function ChipsSelect({
  children,
  action,
  label,
  className,
}) {
  useChipsSelect();

  function renderAction(action: Action, index?: number) {
    return (
      <Button
        key={index}
        color="primary"
        variant="text"
        component={action.to ? Link : undefined}
        to={action.to}
        onClick={action.onClick}
        startIcon={action.icon}
        className={style.action}
      >
        {action.label}
      </Button>
    );
  }

  function renderActions(action: Action | Action[]) {
    if (Array.isArray(action)) {
      return action.map(renderAction);
    }
    return renderAction(action);
  }

  return (
    <div className={classNames(style.root, className)}>
      {label && <Typography className={style.label}>{label}</Typography>}
      <div className={style.body}>
        {children}
        {action && renderActions(action)}
      </div>
    </div>
  );
});

function useChipsSelect() {}
