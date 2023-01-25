import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { MyProfile } from "components/MyProfile";
import { Settings } from "components/Settings";
import { UserInitialNavigation } from "components/UserInitialNavigation";
import { useTable } from "hooks/useTable";
import { AnonymousInitialNavigation } from "components/AnonymousInitialNavigation";
import { Session } from "next-auth";
import { AppFeedbackDialog } from "components/AppFeedbackDialog";
import { OrderHistory as OrderHistoryType } from "domain/types/OrderHistory";
import { OrderHistory } from "components/OrderHistory";
import { OrderDetails } from "components/OrderDetails";
import { useRouter } from "next/router";
import queryString from "querystring";

type Props = {
  session: Session;
  path?: string;
};

export enum Steps {
  Initial = "Initial",
  MyProfile = "MyProfile",
  Settings = "Settings",
  OrderHistory = "OrderHistory",
  OrderDetails = "OrderDetails",
  DeleteProfile = "DeleteProfile",
  Feedback = "Feedback",
  Notifications = "Notifications",
  Location = "Location",
}

export const NavigationDialog: FC<Props> = memo(function NavigationModal(props) {
  const {
    current,
    handleNavigation,
    organizationId,
    handleClose,
    handleClick,
    orderHistoryItem,
    handleOrderHistoryItem,
  } = useNavigationModal(props);
  const { session, path } = props;

  return (
    <>
      {session ? (
        <>
          <UserInitialNavigation
            handleNavigation={handleNavigation}
            onClose={handleClose}
            isOpen={current === Steps.Initial}
          />
          <MyProfile
            handleNavigation={handleNavigation}
            isOpen={current === Steps.MyProfile}
            onClose={handleClose}
          />
          <Settings
            isOpen={current === Steps.Settings && !!organizationId}
            onClose={handleClose}
            path={path}
          />
          <AppFeedbackDialog isOpen={current === Steps.Feedback} session={session} />
          <OrderHistory
            handleNavigation={handleOrderHistoryItem}
            isOpen={current === Steps.OrderHistory}
            handleOrderHistoryItem={handleClick}
            session={session}
          />
          <OrderDetails
            isOpen={current === Steps.OrderDetails}
            orderHistoryItem={orderHistoryItem}
            session={session}
          />
        </>
      ) : (
        <>
          <AnonymousInitialNavigation
            handleNavigation={handleNavigation}
            onClose={handleClose}
            showNavigation={current === Steps.Initial}
          />
          <Settings
            isOpen={current === Steps.Settings && !!organizationId}
            onClose={handleClose}
            path={path}
          />
        </>
      )}
    </>
  );
});

function useNavigationModal(props: Props) {
  const { path } = props;
  const [orderHistoryItem, setOrderHistoryItem] = useState<OrderHistoryType | undefined>();
  const { query, push, back } = useRouter();

  const { organizationId } = useTable();

  const current = useMemo(() => {
    return query.modal;
  }, [query.modal]);

  const handleNavigation = useCallback(
    (step: Steps) => {
      if (path) {
        push(`${path}?${queryString.stringify({ modal: Steps[step] })}`);
      }
    },
    [path, push]
  );

  const handleOrderHistoryItem = useCallback(
    (orderId: number) => {
      if (path) {
        push(`${path}?${queryString.stringify({ modal: Steps.OrderDetails, orderId })}`);
      }
    },
    [path, push]
  );

  const handleClose = useCallback(() => {
    if (path) {
      push(`${path}`);
    }
  }, [path, push]);

  const handleClick = useCallback((item: OrderHistoryType) => {
    setOrderHistoryItem(item);
  }, []);

  return {
    current,
    handleNavigation,
    organizationId,
    handleClose,
    handleClick,
    orderHistoryItem,
    back,
    handleOrderHistoryItem,
  };
}
