import { FC, memo } from "react";
import style from "styles/pages/order/components/OrderNotification.module.scss";
import { ReactComponent as NotificationIcon } from "assets/icons/notifications.svg";
import { Typography } from "@material-ui/core";
import { Trans } from "react-i18next";
import classNames from "classnames";

type Props = {
  type: string;
  venueTable: string;
  location: string;
  containerClassName?: string;
};

export const OrderNotification: FC<Props> = memo(function OrderNotification(
  props
) {
  const { venueTable, location, type, containerClassName } = props;
  useOrderNotification();

  return (
    <div className={classNames(style.container, containerClassName)}>
      <NotificationIcon className={style.icon} />
      <Typography className={style.text}>
        <Trans
          i18nKey="pages.order.notification"
          values={{ type: type, venueTable: venueTable, location: location }}
        />
      </Typography>
    </div>
  );
});

function useOrderNotification() {}
