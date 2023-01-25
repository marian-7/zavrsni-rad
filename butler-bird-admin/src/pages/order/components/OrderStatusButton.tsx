import React, {
  FC,
  memo,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@material-ui/core";
import { useOrganization } from "hooks/useOrganization";
import { useLocal } from "hooks/useLocal";
import { Button } from "components/Button";
import { OrderStatus } from "domain/models/Organization";
import { useToggleState } from "hooks/useToggleState";
import { useMutation, useQueryClient } from "react-query";
import { ordersService, StatusAction } from "domain/services/ordersService";
import { Order } from "domain/models/Order";
import { getLabel } from "domain/util/text";
import style from "styles/pages/order/components/OrderStatusButton.module.scss";
import { AxiosResponse } from "axios";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { toNumber } from "lodash";
import classNames from "classnames";
import { updateOrdersListCache } from "queries/utils/order";

type Props = {
  order: Order;
  groupClassName?: string;
  disabled?: boolean;
};

export const OrderStatusButton: FC<Props> = memo(function OrderActionButton(
  props
) {
  const { groupClassName } = props;
  const {
    anchorRef,
    status,
    local,
    open,
    toggleMenu,
    organization,
    isLoading,
    handleClickAway,
    handleMenuItemClick,
  } = useOrderStatusButton(props);

  function renderStatus(orderStatus: OrderStatus) {
    return (
      <MenuItem
        key={orderStatus.id}
        data-value={orderStatus.id}
        selected={orderStatus.id === status?.id}
        onClick={handleMenuItemClick}
      >
        {getLabel(orderStatus.name, local)}
      </MenuItem>
    );
  }

  return (
    <>
      <ButtonGroup
        ref={anchorRef}
        className={classNames(style.group, groupClassName)}
      >
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={toggleMenu}
          loading={isLoading}
          className={style.button}
        >
          {status && getLabel(status.name, local)}
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        className={style.popper}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "center bottom",
            }}
          >
            <Paper className={style.paper}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <MenuList classes={{ padding: style.listPadding }}>
                  {organization?.orderStatuses.map(renderStatus)}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
});

function useOrderStatusButton({ order }: Props) {
  const qc = useQueryClient();
  const organization = useOrganization();
  const { local } = useLocal();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, toggleMenu, setToggle] = useToggleState(false, [true, false]);
  const { show } = useSnackbar();
  const { t } = useTranslation();

  const handleClickAway = useCallback(() => setToggle(false), [setToggle]);

  const handleStatusChangeSuccess = useCallback(
    ({ data }: AxiosResponse<Order>) => {
      show(t("snackbar.orderStatusChanged"));
      updateOrdersListCache(order, data, qc);
    },
    [order, qc, show, t]
  );

  const { mutateAsync: changeOrderStatus, isLoading } = useMutation(
    (statusAction: StatusAction) => {
      return ordersService.changeOrderStatus(statusAction);
    },
    {
      onSuccess: handleStatusChangeSuccess,
    }
  );

  const handleMenuItemClick = useCallback(
    (e: MouseEvent<HTMLLIElement>) => {
      const statusId = toNumber(e.currentTarget.dataset.value);
      changeOrderStatus({ order: order.id, status: statusId }).catch();
      toggleMenu();
    },
    [changeOrderStatus, order.id, toggleMenu]
  );

  const status = useMemo(() => {
    return organization?.orderStatuses.find((os) => os.id === order.status);
  }, [order.status, organization?.orderStatuses]);

  return {
    anchorRef,
    status,
    local,
    open,
    toggleMenu,
    organization,
    isLoading,
    handleMenuItemClick,
    handleClickAway,
  };
}
