import { apiService } from "domain/services/apiService";
import { Order } from "domain/models/Order";
import { ORDERS_LIMIT } from "util/constants";

function getOrder(order: number | string) {
  return apiService.get<Order>(`/orders/${order}`);
}

function all(skip: number = 0, filter = "") {
  return apiService.get<Order[]>(
    `/orders?_sort=updated_at:DESC&_limit=${ORDERS_LIMIT}&_start=${skip}${
      filter ? `&${filter}` : ""
    }`
  );
}

export interface CancelOrderData extends Partial<Order> {
  id: number;
  canceledReason: string;
}

function cancelOrder(data: CancelOrderData) {
  return apiService.put<Order>(`/orders/cancel/${data.id}`, data);
}

export interface StatusAction {
  order: number;
  status: number;
}

function changeOrderStatus({ order, status }: StatusAction) {
  return apiService.put<Order>(`/orders/${order}`, { status: status });
}

export const ordersService = { all, getOrder, changeOrderStatus, cancelOrder };
