import React, { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import style from "styles/pages/order-preview-page.module.scss";
import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import { getFormattedPrice, getOrderPrice } from "domain/util/price";
import { useCurrency } from "hooks/useCurrency";
import { useTranslation } from "next-i18next";
import { LocalOrder, LocalOrderItem, OrderItem as OrderItemType } from "domain/types/Order";
import { OrderItem } from "components/order/OrderItem";
import { useOrder } from "hooks/useOrder";
import { useRouter } from "next/router";
import { OrderPreviewDialog } from "components/order/OrderPreviewDialog";
import { useMutation } from "react-query";
import { createOrder } from "domain/services/orderService";
import { useTable } from "hooks/useTable";
import { StaffModal } from "components/table/StaffModal";
import { useCallStaff } from "hooks/useCallStaff";
import { CallStaffResultModal } from "components/CallStaffResultModal";
import { paths } from "paths";
import { TextArea } from "components/TextArea";
import { getToken } from "domain/services/userIdentification";
import * as querystring from "querystring";
import queryString from "querystring";
import { Message } from "components/Message";
import { ReactComponent as ShoppingCart } from "assets/icons/shopping-cart.svg";
import { ConfirmOrderModal } from "components/order/ConfirmOrderModal";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { LocalStorage } from "domain/util/localStorage";
import { Session } from "next-auth";
import { SignInDialog } from "components/login/SignInDialog";
import { AppProvider } from "next-auth/providers";
import { ProvidersContext } from "context/ProvidersContext";
import { OrganizationMode } from "domain/types/Organization";

type Props = {
  goBack: () => void;
  session: Session;
  providers: Record<string, AppProvider>;
};

export enum OrderPreviewModalState {
  Success = "Success",
  Cancel = "Cancel",
  Error = "Error",
}

export enum OrderModal {
  Main = "main",
  Staff = "staff",
  StaffSuccess = "staff-success",
  ConfirmOrder = "confirm-order",
  ConfirmDeleteItem = "delete-item",
  Notification = "notification",
  SignIn = "sign-in",
}

export const OrderPreview: FC<Props> = memo(function OrderPreview({ goBack, session, providers }) {
  const {
    orderPrice,
    currency,
    coefficient,
    order,
    locale,
    handleSubmit,
    modalType,
    cancelOrder,
    modalUi,
    isLoading,
    handleCloseDialog,
    customOrderTypes,
    callStaff,
    handleCallStaff,
    redirectToTablePage,
    handleNote,
    handleClickOrderButton,
    signInCallback,
  } = useOrderPreview(session);

  const { t } = useTranslation(["orderPreview", "common"]);

  const renderOrderItem = useCallback((orderItem: LocalOrderItem) => {
    return <OrderItem key={orderItem.id} orderItem={orderItem} />;
  }, []);

  return (
    <div className={style.root}>
      <div className={style.pageContainer}>
        <div className={style.orderPreview}>
          <div>
            <ButtonWithIcon
              onClick={goBack}
              startIcon={<ArrowBackIosIcon />}
              className={style.iconBtn}
              variant="text"
            >
              {t("button.back", { ns: "common" })}
            </ButtonWithIcon>
          </div>
          {order && order.items.length > 0 ? (
            <>
              <Typography className={style.title}>{t("orderSummary")}</Typography>
              <div className={style.container}>
                <div className={style.items}>{order?.items.map(renderOrderItem)}</div>
                <TextArea className="mt-2 mb-2" label={t("label.note")} onChange={handleNote} />
              </div>
              <ConfirmOrderModal
                isOpen={modalType === OrderModal.ConfirmOrder}
                onSubmit={handleSubmit}
              />
              <OrderPreviewDialog
                isOpen={modalType === OrderModal.Main}
                dialogType={modalUi}
                closeDialog={handleCloseDialog}
                retryOrder={handleSubmit}
                callStaff={callStaff}
              />
              {customOrderTypes && customOrderTypes.length > 0 && (
                <StaffModal
                  customOrderTypes={customOrderTypes}
                  isOpen={modalType === OrderModal.Staff}
                  onCallStaff={handleCallStaff}
                  redirectToMenu={redirectToTablePage}
                />
              )}
              <CallStaffResultModal
                isOpen={modalType === OrderModal.StaffSuccess}
                onClose={redirectToTablePage}
              />
              <ProvidersContext.Provider value={providers}>
                {signInCallback && (
                  <SignInDialog
                    isOpen={modalType === OrderModal.SignIn}
                    callbackUrl={signInCallback}
                  />
                )}
              </ProvidersContext.Provider>
            </>
          ) : (
            <Message icon={<ShoppingCart />} message={t("empty")} />
          )}
        </div>

        {order && order.items.length > 0 && (
          <div className={style.controls}>
            <Button
              color="secondary"
              variant="contained"
              onClick={cancelOrder}
              className={style.cancel}
              fullWidth
            >
              {t("button.cancel")}
            </Button>
            {typeof orderPrice === "number" && orderPrice >= 0 && (
              <Button
                loading={isLoading}
                disabled={isLoading}
                loadingText={t("loading", { ns: "common" })}
                color="primary"
                variant="contained"
                className={style.orderBtn}
                onClick={handleClickOrderButton}
                type="submit"
                fullWidth
              >
                {t("button.order", {
                  price: getFormattedPrice(orderPrice, locale!, currency, coefficient),
                })}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

function useOrderPreview(session: Session) {
  const { coefficient, currency } = useCurrency();
  const [modalUi, setModalUi] = useState<OrderPreviewModalState>(OrderPreviewModalState.Error);
  const { order } = useOrder();
  const { locale, replace, query, push } = useRouter();
  const { table } = useTable();
  const [note, setNote] = useState<string>();
  const [signInCallback, setSignInCallback] = useState<string>();

  const modalType = useMemo(() => {
    return query.modal;
  }, [query.modal]);

  const orderPrice = (() => {
    if (order) {
      const price = getOrderPrice(order);
      if (price > 0) {
        return price;
      }
      return 0;
    }
  })();

  const path = useMemo(() => {
    if (table) {
      return paths.orderPreview(table.id);
    }
  }, [table]);

  const openModal = useCallback(() => {
    push(`${path}?${querystring.stringify({ modal: OrderModal.Main })}`);
  }, [path, push]);

  const { mutate, isLoading } = useMutation(
    async (values: { order: LocalOrder; tableId: number | string }) => {
      const { order, tableId } = values;
      const items = order.items.reduce<OrderItemType[]>((orderItems, orderItem) => {
        orderItems.push({
          id: orderItem.item.id,
          amount: orderItem.quantity,
          optionGroups: orderItem.item?.optionGroups?.map((optionGroup) => optionGroup) ?? [],
        });
        return orderItems;
      }, []);
      try {
        const token = getToken();
        if (token) {
          await createOrder(tableId, items, token, note, session?.accessToken);
          setModalUi(OrderPreviewModalState.Success);
        }
      } catch (err) {
        setModalUi(OrderPreviewModalState.Error);
      } finally {
        openModal();
      }
    }
  );

  const handleCloseDialog = useCallback(() => {
    if (path) {
      push(path);
    }
  }, [path, push]);

  const handleSubmit = useCallback(() => {
    if (order && table) {
      mutate({ order, tableId: table.id });
    }
  }, [mutate, order, table]);

  const callbackUrlConfirmOrder = useMemo(() => {
    return `${path}?${queryString.stringify({ modal: OrderModal.ConfirmOrder })}`;
  }, [path]);

  const handlePrompt = useCallback(
    async (url: string) => {
      setSignInCallback(url);
      if (!session) {
        await push(`${path}?${querystring.stringify({ modal: OrderModal.SignIn })}`);
        localStorage.setItem(LocalStorage.Order, JSON.stringify(order));
      } else {
        await push(url);
      }
    },
    [order, path, push, session]
  );

  const callbackUrlLocations = useMemo(() => {
    return paths.locationsList(table?.id);
  }, [table?.id]);

  const handleDeliveryOrOrder = useCallback(async () => {
    const delivery = table?.mode;
    if (delivery === OrganizationMode.Order) {
      await handlePrompt(callbackUrlLocations);
    } else {
      await handlePrompt(callbackUrlConfirmOrder);
    }
  }, [callbackUrlConfirmOrder, callbackUrlLocations, handlePrompt, table?.mode]);

  const handleClickOrderButton = useCallback(async () => {
    const requiresLogin = table?.loginRequired;
    if (requiresLogin) {
      await handleDeliveryOrOrder();
    } else {
      await push(callbackUrlConfirmOrder);
    }
  }, [callbackUrlConfirmOrder, handleDeliveryOrOrder, push, table?.loginRequired]);

  const cancelOrder = useCallback(() => {
    openModal();
    setModalUi(OrderPreviewModalState.Cancel);
  }, [openModal]);

  const handleShowStaffModal = useCallback(() => {
    push(`${path}?${queryString.stringify({ modal: OrderModal.Staff })}`);
  }, [path, push]);

  const handleShowResultModal = useCallback(() => {
    push(`${path}?${querystring.stringify({ modal: OrderModal.StaffSuccess })}`);
  }, [path, push]);

  const { callStaff, handleCallStaff, customOrderTypes } = useCallStaff(
    handleShowStaffModal,
    handleShowResultModal
  );

  const redirectToTablePage = useCallback(() => {
    if (table) {
      replace(paths.tables(table.id));
    }
  }, [replace, table]);

  const handleNote = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  }, []);

  useEffect(() => {
    if (!modalType) {
      localStorage.removeItem("order");
    }
  }, [modalType]);

  return {
    orderPrice,
    currency,
    coefficient,
    order,
    locale,
    modalType,
    cancelOrder,
    modalUi,
    isLoading,
    handleCloseDialog,
    customOrderTypes,
    callStaff,
    handleShowStaffModal,
    handleCallStaff,
    redirectToTablePage,
    handleNote,
    handleClickOrderButton,
    handleSubmit,
    signInCallback,
  };
}
