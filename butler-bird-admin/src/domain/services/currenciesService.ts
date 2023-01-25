import { apiService } from "domain/services/apiService";

function exchange(iso: string) {
  return apiService.get<Record<string, number>>(`/currencies/exchange/${iso}`);
}

export const currenciesService = { exchange };
