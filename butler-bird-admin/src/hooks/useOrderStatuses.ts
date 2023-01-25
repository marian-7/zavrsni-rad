import { useQuery, useQueryClient } from "react-query";
import { orderStatusesService } from "domain/services/orderStatusesService";
import { OrderStatus } from "domain/models/OrderStatus";

export function useOrderStatuses() {
  const qc = useQueryClient();

  return useQuery<OrderStatus[]>(
    "order-statuses",
    ({ queryKey }) => qc.getQueryData(queryKey) ?? orderStatusesService.get()
  );
}
