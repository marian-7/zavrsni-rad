import React, { CSSProperties, FC, memo } from "react";
import listItemStyle from "styles/components/ListItem.module.scss";
import classNames from "classnames";
import orderItemStyle from "styles/pages/orders/components/OrderListItem.module.scss";
import { LinkButton } from "components/LinkButton";
import { Typography } from "@material-ui/core";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import { ReactComponent as NotificationsIcon } from "assets/icons/notifications.svg";
import position from "styles/util/position.module.scss";
import { Order } from "domain/models/Order";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";
import { paths, withSlug } from "paths";
import { useOrganization } from "hooks/useOrganization";
import { Trans } from "react-i18next";
import { getFormattedPrice } from "domain/util/price";
import { isNil } from "lodash";
import { getLocaleDate } from "domain/util/date";

interface Props {
  style: CSSProperties;
  order: Order;
}

export const OrderListItem: FC<Props> = memo(function OrderListItem(props) {
  const { style, order } = props;
  const { location, venue, type, total, date } = useOrderListItem(props);

  return (
    <LinkButton
      style={style}
      to={withSlug(paths.order(order.id))}
      className={classNames(listItemStyle.link, orderItemStyle.link)}
      activeClassName={listItemStyle.linkActive}
    >
      <div className="d-flex align-item-center justify-content-space-between">
        <Typography
          component="span"
          className={classNames(listItemStyle.label, orderItemStyle.location)}
        >
          {location}
        </Typography>
        <Typography
          component="span"
          className={classNames(
            listItemStyle.label,
            position.relative,
            orderItemStyle.date,
            "d-flex align-item-center"
          )}
        >
          {type && <NotificationsIcon />}
          <Typography className={orderItemStyle.dateLabel}>{date}</Typography>
        </Typography>
      </div>
      <Typography
        className={classNames(listItemStyle.title, orderItemStyle.title)}
      >
        {venue} - {order.tableSnapshot.label}
      </Typography>
      <div className="d-flex align-item-center justify-content-space-between">
        {type ? (
          <Typography className={listItemStyle.label}>{type}</Typography>
        ) : (
          <Typography className={listItemStyle.label}>
            <Trans
              i18nKey="pages.orders.total"
              values={{ count: order.itemsSnapshot?.length ?? 0, total }}
              components={{
                total: (
                  <Typography
                    component="span"
                    className={classNames(
                      listItemStyle.label,
                      listItemStyle.labelBold
                    )}
                  />
                ),
              }}
            />
          </Typography>
        )}
        <ArrowIcon
          className={classNames(listItemStyle.icon, orderItemStyle.icon)}
        />
      </div>
    </LinkButton>
  );
});

function useOrderListItem({ order }: Props) {
  const { local } = useLocal();
  const organization = useOrganization();

  const location = getLabel(order.locationSnapshot.name, local);
  const venue = getLabel(order.venueSnapshot.name, local);
  const orderType = organization?.orderTypes.find(
    (type) => type.id === order.type
  );
  const type = orderType ? getLabel(orderType.name, local) : undefined;
  const total = !isNil(order.amount)
    ? getFormattedPrice(order.amount, local, order.currencySnapshot)
    : undefined;

  const date = getLocaleDate(order.createdAt);

  return { location, venue, type, total, date };
}
