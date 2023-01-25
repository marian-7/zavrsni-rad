import React, { FC, memo, MouseEvent } from "react";
import { Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { IconButton } from "components/IconButton";
import style from "styles/components/item/quantity.module.scss";
import classNames from "classnames";

type Props = {
  quantity: number;
  onIncreaseQuantity: (e: MouseEvent<HTMLButtonElement>) => void;
  onDecreaseQuantity: (e: MouseEvent<HTMLButtonElement>) => void;
  allowDisabled?: boolean;
  className?: string;
};

export const Quantity: FC<Props> = memo(function Quantity({
  quantity,
  onDecreaseQuantity,
  onIncreaseQuantity,
  className,
  allowDisabled = true,
}) {
  useQuantity();

  return (
    <div className={classNames("d-flex", className)}>
      <IconButton
        color="primary"
        children={<RemoveIcon />}
        className={style.remove}
        onClick={onDecreaseQuantity}
        disabled={!allowDisabled ? false : quantity === 1}
      />
      <Typography className={style.quantity}>{quantity}</Typography>
      <IconButton
        children={<AddIcon />}
        className={style.add}
        onClick={onIncreaseQuantity}
        color="primary"
      />
    </div>
  );
});

function useQuantity() {}
