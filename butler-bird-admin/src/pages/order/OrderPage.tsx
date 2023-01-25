import { FC, memo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { ordersService } from "domain/services/ordersService";
import { Order } from "domain/models/Order";
import { mapData } from "domain/util/axios";
import { OrderPreview } from "pages/order/components/OrderPreview";
import { AxiosResponse } from "axios";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { updateOrdersListCache } from "queries/utils/order";

type Props = {};

export const OrderPage: FC<Props> = memo(function OrderPage() {
  const { order, handleOrderCancel, cancelingOrder } = useOrderPage();

  return (
    <>
      {order && (
        <OrderPreview
          order={order}
          onOrderCancel={handleOrderCancel}
          canceling={cancelingOrder}
        />
      )}
    </>
  );
});

function useOrderPage() {
  const params = useParams<{ order: string }>();
  const orderId = toNumber(params.order);
  const qc = useQueryClient();
  const { show } = useSnackbar();
  const { t } = useTranslation();

  const { data: order } = useQuery(
    ["orders", orderId],
    ({ queryKey }) => {
      const [, orderId] = queryKey;
      return ordersService.getOrder(orderId).then(mapData);
    },
    {
      placeholderData: () =>
        qc.getQueryData<Order[]>("orders")?.find((o) => o.id === orderId),
    }
  );

  const handleCancelSuccess = useCallback(
    ({ data }: AxiosResponse<Order>) => {
      show(t("snackbar.orderCanceled"));
      updateOrdersListCache(order!, data, qc);
    },
    [order, qc, show, t]
  );

  const { mutateAsync: cancelOrder, isLoading: cancelingOrder } = useMutation(
    ordersService.cancelOrder,
    {
      onSuccess: handleCancelSuccess,
    }
  );

  const handleOrderCancel = useCallback(() => {
    const canceledReason = window.prompt(t("pages.order.reasonExplanation"));
    if (canceledReason) {
      cancelOrder({
        id: orderId,
        canceledReason: canceledReason,
      }).catch(() => {});
    }
  }, [cancelOrder, orderId, t]);

  return { order, handleOrderCancel, cancelingOrder };
}
