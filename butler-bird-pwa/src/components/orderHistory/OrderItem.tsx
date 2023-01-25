import React, { FC, Fragment, memo, useCallback, useMemo, useState } from "react";
import { Option } from "domain/types/Option";
import { Typography } from "@material-ui/core";
import style from "styles/components/order/order-item.module.scss";
import { ReactComponent as OptionDecoration } from "assets/icons/ellipse-outlined.svg";
import { getLabel } from "domain/util/text";
import { getFormattedPrice, getItemPrice } from "domain/util/price";
import { OptionGroup } from "domain/types/OptionGroup";
import { ReactComponent as GroupDecoration } from "assets/icons/ellipse-filled.svg";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import classNames from "classnames";
import { ItemsSnapshot } from "domain/types/OrderHistory";
import { useRouter } from "next/router";
import { useCurrency } from "hooks/useCurrency";
import { useTranslation } from "next-i18next";

type Props = {
  item: ItemsSnapshot;
  currency?: string;
};

export const OrderItem: FC<Props> = memo(function OrderItem({ item, currency }) {
  const { locale, showOptions, itemHasOptions, expandItem, price } = useOrderItem(item);
  const { name, amount } = item;
  const { t } = useTranslation("orderPreview");

  const renderOptions = useCallback(
    (option: Option) => {
      const { price, id, name } = option;
      const amount = option.amount ?? 1;
      return (
        <div key={id} className="d-flex justify-content-space-between">
          <Typography className={style.option}>
            <OptionDecoration className={style.decoration} />
            {amount}x {getLabel(name, locale!)}
          </Typography>
          {price && (
            <Typography color="primary" className={style.currency}>
              {getFormattedPrice(price * amount, locale!, currency, 1)}
            </Typography>
          )}
        </div>
      );
    },
    [currency, locale]
  );

  const renderGroups = useCallback(
    (group: OptionGroup) => {
      return (
        <Fragment key={group.id}>
          <Typography className={style.group}>
            <GroupDecoration className={style.decoration} />
            {getLabel(group.name, locale!)}
          </Typography>
          <div>{group.options.map(renderOptions)}</div>
        </Fragment>
      );
    },
    [locale, renderOptions]
  );

  return (
    <div className={style.root} onClick={expandItem}>
      <div className={style.top}>
        <Typography className={style.text}>
          {t("item", { quantity: amount ?? 1, name: name[locale!] })}
        </Typography>
        {itemHasOptions && (
          <ArrowForwardIosIcon
            className={classNames(style.icon, { [style.rotation]: showOptions })}
          />
        )}
      </div>
      {showOptions && <div className="full-width">{item.optionGroups?.map(renderGroups)}</div>}
      <div
        className={classNames(style.bottom, {
          [style.showOptions]: showOptions && itemHasOptions,
          [style.hiddenOptions]: !showOptions,
        })}
      >
        <Typography color="primary" className={style.currency}>
          {getFormattedPrice(price, locale!, currency, 1)}
        </Typography>
      </div>
    </div>
  );
});

function useOrderItem(item: ItemsSnapshot) {
  const { amount, optionGroups } = item;
  const { locale } = useRouter();
  const { currency, coefficient } = useCurrency();
  const [showOptions, setShowOptions] = useState(false);

  const price = useMemo(() => {
    return getItemPrice(item, amount ?? 1);
  }, [amount, item]);

  const itemHasOptions = useMemo(() => {
    return optionGroups && optionGroups.length > 0;
  }, [optionGroups]);

  const expandItem = useCallback(() => {
    if (itemHasOptions) {
      setShowOptions((prevState) => !prevState);
    }
  }, [itemHasOptions]);

  return {
    locale,
    coefficient,
    currency,
    price,
    expandItem,
    showOptions,
    itemHasOptions,
  };
}
