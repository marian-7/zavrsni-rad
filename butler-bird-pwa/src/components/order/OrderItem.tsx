import React, { FC, Fragment, memo, MouseEvent, useCallback, useMemo, useState } from "react";
import { Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Quantity } from "components/item/Quantity";
import style from "styles/components/order/order-item.module.scss";
import { useTranslation } from "next-i18next";
import { LocalOrderItem } from "domain/types/Order";
import { useRouter } from "next/router";
import { getFormattedPrice, getItemPrice } from "domain/util/price";
import { useCurrency } from "hooks/useCurrency";
import { useOrder } from "hooks/useOrder";
import { OptionGroup, SelectionMode } from "domain/types/OptionGroup";
import { Option } from "domain/types/Option";
import { ReactComponent as GroupDecoration } from "assets/icons/ellipse-filled.svg";
import { ReactComponent as OptionDecoration } from "assets/icons/ellipse-outlined.svg";
import classNames from "classnames";
import { getLabel } from "domain/util/text";
import { DeleteItemModal } from "components/order/DeleteItemModal";
import { OrderModal } from "components/order/OrderPreview";
import * as querystring from "querystring";
import { paths } from "paths";
import { useTable } from "hooks/useTable";

type Props = {
  orderItem: LocalOrderItem;
  hideQuantityComponent?: boolean;
};

export const OrderItem: FC<Props> = memo(function OrderItem({ orderItem }) {
  const {
    locale,
    currency,
    coefficient,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    price,
    expandItem,
    showOptions,
    itemHasOptions,
    handleIncreaseOptionQuantity,
    handleDecreaseOptionQuantity,
    modalType,
    handleRemoveItem,
  } = useOrderItem(orderItem);
  const { t } = useTranslation(["orderPreview", "menu"]);
  const { item, quantity } = orderItem;
  const { name } = item;

  const renderOptionTypes = useCallback(
    (groupId: number, options: Option[], selectionMode: SelectionMode) => {
      return options.map((option) => {
        const { price, id, name, amount } = option;
        return (
          <div key={id} className="d-flex flex-direction-column">
            <div className="d-flex justify-content-space-between">
              <Typography className={style.option}>
                <OptionDecoration className={style.decoration} />
                {getLabel(name, locale!)}
              </Typography>
              <Typography color="primary" className={style.currency}>
                {price < 0 &&
                  t("negativeModifier", {
                    ns: "menu",
                    price: getFormattedPrice(Math.abs(price), locale!, currency, coefficient),
                  })}
                {price > 0 &&
                  t("positiveModifier", {
                    ns: "menu",
                    price: getFormattedPrice(price * (amount ?? 1), locale!, currency, coefficient),
                  })}
              </Typography>
            </div>

            {selectionMode === "multiple" && (
              <Quantity
                allowDisabled={false}
                className={style.optionQuantity}
                quantity={option.amount ?? 1}
                onIncreaseQuantity={handleIncreaseOptionQuantity(
                  groupId,
                  option.id,
                  option.amount ?? 1
                )}
                onDecreaseQuantity={handleDecreaseOptionQuantity(
                  groupId,
                  option.id,
                  option.amount ?? 1
                )}
              />
            )}
          </div>
        );
      });
    },
    [coefficient, currency, handleDecreaseOptionQuantity, handleIncreaseOptionQuantity, locale, t]
  );

  const renderGroups = useCallback(
    (group: OptionGroup) => {
      return (
        <Fragment key={group.id}>
          <Typography className={style.group}>
            <GroupDecoration className={style.decoration} />
            {getLabel(group.name, locale!)}
          </Typography>
          <div>{renderOptionTypes(group.id, group.options, group.selectionMode)}</div>
        </Fragment>
      );
    },
    [locale, renderOptionTypes]
  );

  return (
    <div className={style.root} onClick={expandItem}>
      <div className={style.top}>
        <Typography className={style.text}>
          {t("item", { quantity: quantity, name: name[locale!] })}
        </Typography>
        {itemHasOptions && (
          <div className={style.sign}>
            <ArrowForwardIosIcon
              className={classNames(style.icon, { [style.rotation]: showOptions })}
            />
            <Typography className={style.signText}>
              {showOptions ? t("collapse") : t("expand")}
            </Typography>
          </div>
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
          {getFormattedPrice(price, locale!, currency, coefficient)}
        </Typography>
        <Quantity
          quantity={quantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onIncreaseQuantity={handleIncreaseQuantity}
          allowDisabled={false}
        />
      </div>
      <DeleteItemModal
        isOpen={modalType === OrderModal.ConfirmDeleteItem}
        onClick={handleRemoveItem}
      />
    </div>
  );
});

function useOrderItem(orderItem: LocalOrderItem) {
  const { locale, query, push, back } = useRouter();
  const { currency, coefficient } = useCurrency();
  const [showOptions, setShowOptions] = useState(false);
  const { item } = orderItem;
  const { table } = useTable();

  const path = useMemo(() => {
    if (table) {
      return paths.orderPreview(table.id);
    }
  }, [table]);

  const modalType = useMemo(() => {
    return query.modal;
  }, [query.modal]);

  const { editItem, removeItem } = useOrder();

  const price = (() => {
    return getItemPrice(orderItem.item, orderItem.quantity);
  })();

  const itemHasOptions = useMemo(() => {
    return item.optionGroups && item.optionGroups.length > 0;
  }, [item.optionGroups]);

  const handleIncreaseQuantity = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const quantity = orderItem.quantity + 1;
      const newItem = { ...orderItem, quantity, price: getItemPrice(orderItem.item, quantity) };
      editItem(newItem);
    },
    [editItem, orderItem]
  );

  const handleRemoveItem = useCallback(() => {
    removeItem(orderItem.id);
    back();
  }, [back, orderItem.id, removeItem]);

  const handleDecreaseQuantity = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const quantity = orderItem.quantity - 1;
      if (quantity) {
        const newItem = { ...orderItem, quantity, price: getItemPrice(orderItem.item, quantity) };
        editItem(newItem);
      } else {
        push(`${path}?${querystring.stringify({ modal: OrderModal.ConfirmDeleteItem })}`);
      }
    },
    [editItem, orderItem, path, push]
  );

  const expandItem = useCallback(() => {
    if (itemHasOptions) {
      setShowOptions((prevState) => !prevState);
    }
  }, [itemHasOptions]);

  const handleIncreaseOptionQuantity = useCallback(
    (groupId: number, optionId: number, amount: number) => {
      return (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        const orderItemCopy = { ...orderItem };
        orderItemCopy.item.optionGroups = handleAmount(
          orderItemCopy.item.optionGroups,
          optionId,
          amount + 1
        );
        editItem(orderItemCopy);
      };
    },
    [editItem, orderItem]
  );

  const handleDecreaseOptionQuantity = useCallback(
    (groupId: number, optionId: number, amount: number) => {
      return (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const orderItemCopy = { ...orderItem };
        if (amount === 1) {
          orderItemCopy.item.optionGroups = orderItemCopy.item.optionGroups
            ?.map((group) => {
              return {
                ...group,
                options: group.options.filter((option) => {
                  return option.id !== optionId;
                }),
              };
            })
            .filter((group) => group.options.length > 0);
        } else {
          orderItemCopy.item.optionGroups = handleAmount(
            orderItemCopy.item.optionGroups,
            optionId,
            amount - 1
          );
        }
        editItem(orderItemCopy);
      };
    },
    [editItem, orderItem]
  );

  return {
    locale,
    coefficient,
    currency,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    price,
    expandItem,
    showOptions,
    itemHasOptions,
    modalType,
    handleRemoveItem,
    handleIncreaseOptionQuantity,
    handleDecreaseOptionQuantity,
  };
}

function handleAmount(optionGroups: OptionGroup[] | undefined, optionId: number, amount: number) {
  return optionGroups?.map((group) => {
    return {
      ...group,
      options: group.options.map((option) => {
        if (option.id === optionId && option.amount) {
          return { ...option, amount };
        }
        return option;
      }),
    };
  });
}
