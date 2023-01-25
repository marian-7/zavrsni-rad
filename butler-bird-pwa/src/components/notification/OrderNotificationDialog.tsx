import React, { ChangeEvent, FC, memo, useCallback, useState } from "react";
import { Dialog } from "components/Dialog";
import { useTable } from "hooks/useTable";
import { Message } from "components/Message";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { useTranslation } from "next-i18next";
import { Button } from "components/Button";
import { useOrder } from "hooks/useOrder";
import { useRouter } from "next/router";
import { useNotificationPreferences } from "hooks/useNotificationPreferences";
import { paths } from "paths";
import { useSession } from "next-auth/client";
import { Cookies, deleteCookie, getCookie, setCookieByName } from "domain/util/cookies";
import { LocalStorage } from "domain/util/localStorage";
import { Checkbox } from "components/Checkbox";
import style from "styles/components/notification/order-notification-form.module.scss";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ButtonWithIcon } from "components/ButtonWithIcon";

type Props = {
  isOpen: boolean;
  nextStep: () => void;
};

export enum NotificationPreference {
  PushNotification = "izooto",
  Email = "email",
}

export const OrderNotificationDialog: FC<Props> = memo(function OrderNotificationDialog(props) {
  const {
    handlePushNotificationChoice,
    handleEmail,
    rememberChoice,
    handleCheckbox,
    back,
  } = useOrderNotificationDialog(props);
  const { isOpen } = props;

  const { t } = useTranslation("common");

  return (
    <Dialog open={isOpen} noPadding>
      <ButtonWithIcon startIcon={<ArrowBackIosIcon />} className={style.iconBtn} onClick={back}>
        {t("button.back")}
      </ButtonWithIcon>
      <Message
        icon={<NotificationsNoneIcon />}
        message={t("notificationPreferences.info")}
        mainButton={
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mb-3"
            onClick={handlePushNotificationChoice}
            disabled
          >
            {t("notificationPreferences.button.notifications")}
          </Button>
        }
        secondButton={
          <Button color="primary" fullWidth onClick={handleEmail}>
            {t("notificationPreferences.button.email")}
          </Button>
        }
      />
      <Checkbox
        className={style.checkbox}
        label={t("notificationPreferences.label.ask")}
        checked={rememberChoice}
        onChange={handleCheckbox}
      />
    </Dialog>
  );
});

function useOrderNotificationDialog(props: Props) {
  const { nextStep } = props;
  const { cachedPreference, setPreferences } = useNotificationPreferences();
  const [rememberChoice, setRememberChoice] = useState(
    !!getCookie(Cookies.NotificationMethod) ?? !!cachedPreference ?? false
  );
  const { push, back } = useRouter();
  const [session] = useSession();
  const { order } = useOrder();
  const { table } = useTable();

  const handleCheckbox = useCallback((e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setRememberChoice(checked);
  }, []);

  const handleRememberChoice = useCallback(
    (method: NotificationPreference) => {
      if (rememberChoice) {
        setCookieByName(Cookies.NotificationMethod, method);
      } else {
        deleteCookie(Cookies.NotificationMethod);
        setPreferences(method);
      }
    },
    [rememberChoice, setPreferences]
  );

  const handleNextStep = useCallback(() => {
    if (nextStep) {
      nextStep();
    } else {
      back();
    }
  }, [back, nextStep]);

  const handlePushNotificationChoice = useCallback(() => {
    handleRememberChoice(NotificationPreference.PushNotification);
    handleNextStep();
  }, [handleNextStep, handleRememberChoice]);

  const handleEmail = useCallback(async () => {
    handleRememberChoice(NotificationPreference.Email);
    if (session && nextStep) {
      nextStep();
    } else {
      localStorage.setItem(LocalStorage.Order, JSON.stringify(order));
      await push(paths.emailNotifications(table?.id));
    }
  }, [handleRememberChoice, nextStep, order, push, session, table?.id]);

  return {
    handlePushNotificationChoice,
    handleEmail,
    rememberChoice,
    handleCheckbox,
    back,
  };
}
