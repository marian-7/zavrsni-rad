import React, { FC, memo } from "react";
import { ButtonBase, Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import style from "styles/components/text-button.module.scss";
import classNames from "classnames";

type Props = {
  onClick?: () => void;
  label: string;
  className?: string;
};

export const TextButton: FC<Props> = memo(function TextButton({ onClick, label, className }) {
  useTextButton();

  return (
    <ButtonBase className={classNames(style.root, className)} onClick={onClick}>
      <Typography className={style.text}>{label}</Typography>
      <ArrowForwardIosIcon className={style.icon} />
    </ButtonBase>
  );
});

function useTextButton() {}
