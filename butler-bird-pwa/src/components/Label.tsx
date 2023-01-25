import React, { FC, memo } from "react";
import { Typography } from "@material-ui/core";
import style from "styles/components/label.module.scss";
import classNames from "classnames";

type Props = {
  text?: string;
  price: string | null;
  className?: string;
};

export const Label: FC<Props> = memo(function Label({ text, price, className }) {
  useLabel();

  return (
    <div className={classNames(style.root, className)}>
      <Typography>{text}</Typography>
      <Typography color="primary" className={style.price}>
        {price}
      </Typography>
    </div>
  );
});

function useLabel() {}
