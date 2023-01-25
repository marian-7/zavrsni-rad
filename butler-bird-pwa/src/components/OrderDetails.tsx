import React, { FC, memo, useCallback, useMemo } from "react";
import { Trans, useTranslation } from "next-i18next";
import { Typography, useTheme } from "@material-ui/core";
import { Dialog } from "components/Dialog";
import style from "styles/components/order-details.module.scss";
import { ItemsSnapshot, OrderHistory } from "domain/types/OrderHistory";
import { OrderItem } from "./orderHistory/OrderItem";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getOrderById } from "domain/services/orderService";
import { getToken } from "domain/services/userIdentification";
import { Session } from "next-auth";

type Props = {
  isOpen: boolean;
  orderHistoryItem?: OrderHistory;
  session: Session;
};

export const OrderDetails: FC<Props> = memo(function OrderDetails(props) {
  const { isOpen, orderHistoryItem } = props;
  const { data } = useOrderDetails(props);
  const { back } = useRouter();
  const { t } = useTranslation(["common", "orderPreview"]);
  const theme = useTheme();

  const renderOrderItem = useCallback(
    (orderItem: ItemsSnapshot) => {
      return (
        <OrderItem
          key={orderItem.id}
          item={orderItem}
          currency={orderHistoryItem?.currencySnapshot || data?.currencySnapshot}
        />
      );
    },
    [data?.currencySnapshot, orderHistoryItem?.currencySnapshot]
  );

  let item = orderHistoryItem ?? data;
  if (!item) {
    return null;
  }

  const { itemsSnapshot: items, canceledReason } = item;

  return (
    <Dialog
      open={isOpen}
      onBack={back}
      backText={t("navigation.button.backToOrderHistory")}
      containerClassName={style.container}
    >
      <Typography className={style.text}>{t("orderSummary", { ns: "orderPreview" })}</Typography>
      {canceledReason && (
        <Typography className="mb-2">
          <Trans
            t={t}
            i18nKey={"navigation.orderCanceledReason"}
            components={{
              b: (
                <strong className={style.canceled} style={{ color: theme.palette.primary.main }} />
              ),
            }}
            values={{
              message: canceledReason,
            }}
          />
        </Typography>
      )}
      <div>{items?.map(renderOrderItem)}</div>
    </Dialog>
  );
});

function useOrderDetails(props: Props) {
  const { orderHistoryItem, session } = props;
  const { back, query } = useRouter();

  const backToOrderHistory = useCallback(() => {
    back();
  }, [back]);

  const orderId = useMemo(() => {
    if (!Array.isArray(query.orderId)) {
      return query.orderId;
    }
  }, [query.orderId]);

  const { data } = useQuery(
    ["orderHistoryItem", orderId],
    async ({ queryKey }) => {
      const [, id] = queryKey;
      const token = getToken();
      try {
        if (id) {
          const res = await getOrderById(id, token, session.accessToken);
          return res.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    { enabled: !!orderId && !orderHistoryItem }
  );

  return { backToOrderHistory, data };
}
