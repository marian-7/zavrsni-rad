import React, { FC, memo, useCallback, useMemo } from "react";
import style from "styles/pages/ordersTicketing/components/OrderTicket.module.scss";
import { ItemsSnapshot, Order } from "domain/models/Order";
import { IconButton, Typography } from "@material-ui/core";
import { Separator } from "components/Separator";
import classNames from "classnames";
import { OrderItem } from "pages/order/components/OrderItem";
import { Trans, useTranslation } from "react-i18next";
import { getLocaleDate } from "domain/util/date";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";
import { OrderNotification } from "pages/order/components/OrderNotification";
import { getFormattedPrice } from "domain/util/price";
import { OrderStatusButton } from "pages/order/components/OrderStatusButton";
import { useOrganization } from "hooks/useOrganization";
import { ReactComponent as CancelIcon } from "assets/icons/close.svg";
import { AxiosResponse } from "axios";
import { updateOrdersListCache } from "queries/utils/order";
import { useMutation, useQueryClient } from "react-query";
import { ordersService } from "domain/services/ordersService";
import { useSnackbar } from "hooks/useSnackbar";

type Props = {
  order: Order;
};

export const OrderTicket: FC<Props> = memo(function OrderTicket(props) {
  const { order } = props;
  const {
    t,
    createdAt,
    location,
    venueTable,
    total,
    orderTypeLabel,
    handleOrderCancel,
  } = useOrderTicket(props);

  function renderItem(item: ItemsSnapshot, index: number) {
    return (
      <OrderItem
        key={index}
        item={item}
        currency={order.currencySnapshot}
        containerClassName={style.item}
      />
    );
  }

  return (
    <div className={style.ticket}>
      <div className={style.header}>
        <div
          className={classNames(
            "d-flex align-item-center justify-content-space-between",
            style.mb
          )}
        >
          <Typography className={style.headerOrder}>
            {t("pages.order.orderNumber", { number: order.id })}
          </Typography>
          {!order.canceledAt && (
            <IconButton
              onClick={handleOrderCancel}
              className={style.headerCancel}
            >
              <CancelIcon />
            </IconButton>
          )}
        </div>
        <Typography className={style.headerTime}>{createdAt}</Typography>
        <div className="d-flex align-item-center">
          <Typography>{venueTable}</Typography>
          <Separator size={8} mh={10} />
          <Typography>{location}</Typography>
        </div>
      </div>
      {order?.type ? (
        <>
          <div className={style.body}>
            <OrderNotification
              type={orderTypeLabel!}
              venueTable={venueTable}
              location={location}
            />
          </div>
          <div className={style.footer}>
            {!order.canceledAt ? (
              <OrderStatusButton
                order={order}
                groupClassName={style.footerStatusBtn}
              />
            ) : (
              <>
                <Typography className={style.footerCanceled}>
                  <Trans
                    i18nKey="pages.order.canceledAt"
                    values={{ canceledAt: getLocaleDate(order.canceledAt) }}
                  />
                </Typography>
                <Typography className={style.footerCanceled}>
                  <Trans
                    i18nKey="pages.order.canceledReason"
                    values={{ canceledReason: order.canceledReason }}
                  />
                </Typography>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={style.body}>
            {order.itemsSnapshot.map(renderItem)}
          </div>
          <div className={style.footer}>
            {order.note && (
              <Typography className={style.footerNote}>
                <Trans
                  i18nKey="pages.order.note"
                  values={{ note: order.note }}
                />
              </Typography>
            )}
            <div className="d-flex align-item-center justify-content-space-between">
              <Typography className={style.footerTotal}>
                {t("pages.ordersTicketing.ticket.total", {
                  total: total,
                })}
              </Typography>
              {!order.canceledAt && <OrderStatusButton order={order} />}
            </div>
            {order.canceledAt && (
              <>
                <Typography className={style.footerCanceled}>
                  <Trans
                    i18nKey="pages.order.canceledAt"
                    values={{ canceledAt: getLocaleDate(order.canceledAt) }}
                  />
                </Typography>
                <Typography className={style.footerCanceled}>
                  <Trans
                    i18nKey="pages.order.canceledReason"
                    values={{ canceledReason: order.canceledReason }}
                  />
                </Typography>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
});

function useOrderTicket({ order }: Props) {
  const organization = useOrganization();
  const { t } = useTranslation();
  const { local } = useLocal();
  const { show } = useSnackbar();
  const qc = useQueryClient();

  const createdAt = getLocaleDate(order.createdAt);
  const venueTable = `${getLabel(order.venueSnapshot.name, local)} - ${
    order.tableSnapshot.label
  }`;
  const location = getLabel(order.locationSnapshot.name, local);
  const total = getFormattedPrice(order.amount!, local, order.currencySnapshot);

  const orderType = useMemo(() => {
    return organization?.orderTypes.find((t) => t.id === order?.type);
  }, [order.type, organization?.orderTypes]);

  const orderTypeLabel = useMemo(() => {
    return orderType && getLabel(orderType.name, local);
  }, [local, orderType]);

  const handleCancelSuccess = useCallback(
    ({ data: updatedOrder }: AxiosResponse<Order>) => {
      show(t("snackbar.orderCanceled"));
      updateOrdersListCache(order, updatedOrder, qc);
    },
    [order, qc, show, t]
  );

  const { mutateAsync: cancelOrder } = useMutation(ordersService.cancelOrder, {
    onSuccess: handleCancelSuccess,
  });

  const handleOrderCancel = useCallback(() => {
    const canceledReason = window.prompt(t("pages.order.reasonExplanation"));
    if (canceledReason) {
      cancelOrder({
        id: order.id,
        canceledReason: canceledReason,
      }).catch(() => {});
    }
  }, [cancelOrder, order.id, t]);

  return {
    t,
    createdAt,
    venueTable,
    location,
    total,
    orderTypeLabel,
    handleOrderCancel,
  };
}
