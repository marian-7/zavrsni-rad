import { Order } from "domain/models/Order";
import { chunk, flatten } from "lodash";
import { ORDERS_LIMIT } from "util/constants";
import { QueryClient } from "react-query";

export function updateOrdersListCache(
  order: Order,
  updatedOrder: Order,
  qc: QueryClient
) {
  qc.setQueryData<Order>(["orders", order.id], updatedOrder);
  qc.getQueryCache()
    .findAll()
    .filter((query) => {
      const key = query.queryKey;
      if (!Array.isArray(key)) {
        return false;
      }
      return (
        key[0] === "orders" &&
        key.length === 6 &&
        (key[4] === order.status || key[4] === updatedOrder.status)
      );
    })
    .forEach((query) => {
      const data = query.state.data as { pages: Order[][] };
      const orders = flatten(data.pages);

      let updatedOrders;
      if (order.status === updatedOrder.status) {
        updatedOrders =
          orders.findIndex((o) => o?.id === order.id) !== -1
            ? orders.map((o) =>
                o !== null && o.id !== order.id ? o : updatedOrder
              )
            : [updatedOrder].concat(orders);
      } else {
        updatedOrders =
          orders.findIndex((o) => o?.id === order.id) !== -1
            ? orders.map((o) => (o !== null && o.id !== order.id ? o : null))
            : [updatedOrder].concat(orders);
      }

      const pages = chunk(updatedOrders, ORDERS_LIMIT);
      const pageParams = pages.map((_, i) => i + 1);
      qc.setQueryData(query.queryKey, { pages, pageParams });
    });
}

export function updateOrdersOnEmit(order: Order, qc: QueryClient) {
  qc.setQueryData<Order>(["orders", order.id], order);
  qc.getQueryCache()
    .findAll()
    .filter((query) => {
      const key = query.queryKey;
      if (!Array.isArray(key)) {
        return false;
      }
      return key[0] === "orders" && key.length === 6 && key[4] === order.status;
    })
    .forEach((query) => {
      const data = query.state.data as { pages: Order[][] };
      const orders = flatten(data.pages);
      const updatedOrders = [order].concat(orders);
      const pages = chunk(updatedOrders, ORDERS_LIMIT);
      const pageParams = pages.map((_, i) => i + 1);
      qc.setQueryData(query.queryKey, { pages, pageParams });
    });
}
