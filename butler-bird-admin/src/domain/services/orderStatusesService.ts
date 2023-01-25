import { apiService } from "domain/services/apiService";
import { mapData } from "domain/util/axios";

export function get() {
  return apiService.get("/order-statuses").then(mapData);
}

export const orderStatusesService = {
  get,
};
