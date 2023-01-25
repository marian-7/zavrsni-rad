import React, { FC, memo, useCallback } from "react";
import { Item } from "domain/types/Item";
import { ButtonBase, Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useRouter } from "next/router";
import { getFormattedPrice } from "domain/util/price";
import style from "styles/components/menu/menu-item.module.scss";
import classNames from "classnames";
import { ReactComponent as NoImage } from "assets/icons/no-image.svg";
import { getImage, ImageFormat } from "domain/util/getImage";
import { useCurrency } from "hooks/useCurrency";
import { getLabel } from "domain/util/text";
import { useMenu } from "hooks/useMenu";

type Props = {
  item: Item;
  className?: string;
  onItemClick: (item: Item) => void;
};

export const MenuItem: FC<Props> = memo(function MenuItem({ item, className }) {
  const { handleClick, currency, coefficient } = useMenuItem(item);
  const { locale } = useRouter();

  const { name, description, price, image } = item;

  return (
    <ButtonBase className={classNames(style.root, className)} onClick={handleClick}>
      {image ? (
        <img
          className={style.image}
          src={getImage(image, ImageFormat.Thumbnail)}
          alt={name[locale!]}
        />
      ) : (
        <NoImage className={style.image} />
      )}
      <div className={style.right}>
        <Typography className={style.name}>{getLabel(name, locale!)}</Typography>
        <Typography className={classNames(style.description, "mb-1")}>
          {getLabel(description, locale!)}
        </Typography>
        <div className="d-flex justify-content-space-between align-items-center">
          <Typography className={style.price} color="primary">
            {currency && coefficient && getFormattedPrice(price, locale!, currency, coefficient)}
          </Typography>
          <ArrowForwardIosIcon className={style.icon} />
        </div>
      </div>
    </ButtonBase>
  );
});

function useMenuItem(item: Item) {
  const { onItemClick } = useMenu();
  const { currency, coefficient } = useCurrency();

  const handleClick = useCallback(() => {
    onItemClick(item);
  }, [item, onItemClick]);

  return { handleClick, currency, coefficient };
}
