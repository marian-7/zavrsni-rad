import { api } from "domain/services/apiService";
import { OrderHistory } from "domain/types/OrderHistory";
import { ORDER_HISTORY_LIMIT } from "domain/util/const";
import { OrderItem } from "domain/types/Order";

export function createCustomOrder(table: string | number, type: number, installation: string) {
  return api.post("orders/custom", {
    table,
    type,
    installation,
  });
}

export function createOrder(
  table: number | string,
  items: OrderItem[],
  installation: string,
  note?: string,
  accessToken?: string
) {
  const headers: { [header: string]: string } = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return api.post(
    "orders",
    {
      table,
      note,
      items,
      installation,
    },
    {
      headers,
    }
  );
}

export function getOrderHistory(installation: string, page: number, accessToken?: string) {
  const headers: { [header: string]: string } = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const limit = ORDER_HISTORY_LIMIT;
  const start = page * limit - limit;
  return api.get<OrderHistory[]>(
    `app/orders/${installation}?type_null=true&_start=${start}&_limit=${limit}`,
    {
      headers,
    }
  );
}

export function getOrderById(orderId: string, token: string, accessToken?: string) {
  const headers: { [header: string]: string } = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return api.get<OrderHistory>(`app/orders/${orderId}/${token}`, headers);
}
