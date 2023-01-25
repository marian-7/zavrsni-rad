import React, { FC, memo, useMemo } from "react";
import { ItemsSnapshot, Order } from "domain/models/Order";
import style from "styles/pages/order/components/OrderPreview.module.scss";
import { Typography } from "@material-ui/core";
import { useLocal } from "hooks/useLocal";
import { Trans, useTranslation } from "react-i18next";
import { getFormattedPrice } from "domain/util/price";
import { OrderItem } from "pages/order/components/OrderItem";
import { Separator } from "components/Separator";
import { getLabel } from "domain/util/text";
import { getLocaleDate } from "domain/util/date";
import { OrderNotification } from "pages/order/components/OrderNotification";
import { OrderStatusButton } from "pages/order/components/OrderStatusButton";
import classNames from "classnames";
import { useOrganization } from "hooks/useOrganization";
import singlePageStyle from "styles/components/SinglePage.module.scss";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Button } from "components/Button";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";

type Props = {
  order: Order;
  onOrderCancel: () => void;
  canceling: boolean;
};

export const OrderPreview: FC<Props> = memo(function OrderPreview(props) {
  const { order, onOrderCancel, canceling } = props;
  const {
    t,
    total,
    createdAt,
    venueTable,
    location,
    orderTypeLabel,
  } = useOrderPreview(props);

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
    <OverlayScrollbarsComponent
      className={singlePageStyle.container}
      options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
    >
      <div className={style.header}>
        <div className={style.headerTextGroup}>
          <Typography className={style.headerTitle}>{venueTable}</Typography>
          <div className={style.headerDetails}>
            <Typography className={style.headerLabel}>{location}</Typography>
            <div
              className={classNames(
                style.headerDetail,
                style.headerDetailSeparator
              )}
            >
              <Separator mh={10} size={8} />
              {order?.type ? (
                <Typography>{orderTypeLabel}</Typography>
              ) : (
                <Typography>
                  {t("pages.order.orderNumber", { number: order.id })}
                </Typography>
              )}
            </div>
            <div
              className={classNames(
                style.headerDetail,
                style.headerDetailSeparator
              )}
            >
              <Separator mh={10} size={8} />
              <Typography>{createdAt}</Typography>
            </div>
            {!order?.type && (
              <div
                className={classNames(
                  style.headerDetail,
                  style.headerDetailSeparator
                )}
              >
                <Separator mh={10} size={8} />
                <Typography className={style.headerTotal}>
                  {t("pages.order.total", { total: total })}
                </Typography>
              </div>
            )}
          </div>
        </div>
        {!order.canceledAt && (
          <>
            <Button
              variant="text"
              color="primary"
              size="medium"
              rootClassName={style.cancel}
              startIcon={<DeleteIcon />}
              onClick={onOrderCancel}
              loading={canceling}
            >
              {t("pages.order.cancelOrder")}
            </Button>
            <OrderStatusButton order={order} disabled={canceling} />
          </>
        )}
      </div>
      {order?.type ? (
        <OrderNotification
          type={orderTypeLabel!}
          venueTable={venueTable}
          location={location}
          containerClassName={style.notification}
        />
      ) : (
        <>
          {order.itemsSnapshot.map(renderItem)}
          <div className={style.footer}>
            {order.note && (
              <Typography className={style.footerNote}>
                <Trans
                  i18nKey="pages.order.note"
                  values={{ note: order.note }}
                />
              </Typography>
            )}
            <Typography className={style.footerTotal}>
              {t("pages.order.total", {
                total: total,
              })}
            </Typography>
          </div>
        </>
      )}
      {order.canceledAt && (
        <div className={classNames(style.footer, "mt-1")}>
          <Typography
            className={classNames(style.footerCanceled, style.footerNote)}
          >
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
        </div>
      )}
    </OverlayScrollbarsComponent>
  );
});

function useOrderPreview({ order }: Props) {
  const organization = useOrganization();
  const { local } = useLocal();
  const { t } = useTranslation();

  const total = getFormattedPrice(order.amount!, local, order.currencySnapshot);
  const createdAt = getLocaleDate(order.createdAt);
  const venueTable = `${getLabel(order.venueSnapshot.name, local)} - ${
    order.tableSnapshot.label
  }`;
  const location = getLabel(order.locationSnapshot.name, local);

  const orderType = useMemo(() => {
    return organization?.orderTypes.find((t) => t.id === order?.type);
  }, [order.type, organization?.orderTypes]);

  const orderTypeLabel = useMemo(() => {
    return orderType && getLabel(orderType.name, local);
  }, [local, orderType]);

  return {
    t,
    local,
    total,
    createdAt,
    venueTable,
    location,
    orderTypeLabel,
  };
}
