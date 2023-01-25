import React, { FC, memo } from "react";
import MuiCheckbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { ReactComponent as CheckOutlineIcon } from "assets/icons/check-outline.svg";
import { ReactComponent as CheckBoxIcon } from "assets/icons/check-box.svg";
import style from "styles/components/Checkbox.module.scss";
import classNames from "classnames";

interface Props extends CheckboxProps {}

export const Checkbox: FC<Props> = memo(function Checkbox(props) {
  useCheckbox();

  return (
    <MuiCheckbox
      color="primary"
      classes={{ root: style.root }}
      icon={
        <CheckOutlineIcon
          className={classNames("MuiSvgIcon-root", style.icon)}
        />
      }
      checkedIcon={<CheckBoxIcon className="MuiSvgIcon-root" />}
      {...props}
    />
  );
});

function useCheckbox() {}
