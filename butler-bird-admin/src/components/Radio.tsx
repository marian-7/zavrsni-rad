import React, { FC, memo } from "react";
import MuiRadio, { RadioProps } from "@material-ui/core/Radio";
import { ReactComponent as RadioCheckedIcon } from "assets/icons/radio-checked.svg";
import { ReactComponent as RadioIcon } from "assets/icons/radio.svg";
import style from "styles/components/Radio.module.scss";
import classNames from "classnames";

interface Props extends RadioProps {}

export const Radio: FC<Props> = memo(function Radio(props) {
  useRadio();

  return (
    <MuiRadio
      color="primary"
      classes={{ root: style.root }}
      icon={<RadioIcon className={classNames("MuiSvgIcon-root", style.icon)} />}
      checkedIcon={<RadioCheckedIcon className="MuiSvgIcon-root" />}
      {...props}
    />
  );
});

function useRadio() {}
