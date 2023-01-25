import { Typography } from "@material-ui/core";
import React, { FC, memo } from "react";
import style from "styles/components/item/description.module.scss";
import { ReactComponent as OptionDecoration } from "assets/icons/ellipse-outlined.svg";
import classNames from "classnames";

type Props = {
  text?: string;
  className?: string;
};

export const Description: FC<Props> = memo(function Description({ text, className }) {
  useDescription();

  return (
    <div className={classNames(style.root, className)}>
      <OptionDecoration className={style.icon} />
      <Typography className={style.text}>{text}</Typography>
    </div>
  );
});

function useDescription() {}
