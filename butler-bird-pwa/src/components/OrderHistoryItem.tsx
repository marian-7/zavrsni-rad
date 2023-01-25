import React, { CSSProperties, FC, memo, useCallback } from "react";
import style from "styles/components/order-history-item.module.scss";
import { ButtonBase, Typography, useTheme } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Trans, useTranslation } from "next-i18next";
import { getFormattedPrice } from "domain/util/price";
import { getOrderDateTime } from "domain/util/dateTime";
import { OrderHistory } from "domain/types/OrderHistory";
import { useRouter } from "next/router";

type Props = {
  order: OrderHistory;
  fixedListItemStyle: CSSProperties;
  goToOrderDetails: (orderHistoryItem: OrderHistory) => void;
};

export const OrderHistoryItem: FC<Props> = memo(function OrderHistoryItem(props) {
  const { order, fixedListItemStyle } = props;
  const { createdAt, currencySnapshot, locationSnapshot, amount, canceledAt } = order;
  const { name } = locationSnapshot;
  const { handleClick } = useOrderHistoryItem(props);
  const { locale } = useRouter();

  const { t } = useTranslation("common");
  const theme = useTheme();

  return (
    <div className={style.root} style={fixedListItemStyle}>
      <ButtonBase className={style.container} onClick={handleClick}>
        <Typography className={style.bold}>{name[locale!]}</Typography>
        <Typography className={style.text}>{getOrderDateTime(createdAt, locale!)}</Typography>
        <div className="d-flex justify-content-space-between align-items-center full-width">
          {!canceledAt ? (
            <Typography className={style.text}>
              <Trans
                t={t}
                i18nKey={"navigation.orderTotal"}
                components={{ b: <strong style={{ color: theme.palette.primary.main }} /> }}
                values={{
                  price:
                    typeof amount === "number"
                      ? getFormattedPrice(amount, locale!, currencySnapshot, 1)
                      : undefined,
                }}
              />
            </Typography>
          ) : (
            <Typography className={style.canceledText}>{t("navigation.orderCanceled")}</Typography>
          )}
          <ArrowForwardIosIcon className={style.icon} />
        </div>
      </ButtonBase>
    </div>
  );
});

function useOrderHistoryItem(props: Props) {
  const handleClick = useCallback(() => {
    props.goToOrderDetails(props.order);
  }, [props]);

  return { handleClick };
}
