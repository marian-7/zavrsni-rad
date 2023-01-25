import { apiService } from "domain/services/apiService";
import { Table } from "domain/models/Venue";

interface BulkCreateData {
  labelTemplate: string;
  labelStartAt: number;
  amount: number;
  venue?: number;
}

function all(query: string = "") {
  return apiService.get<Table[]>(`/tables${query}`);
}

function bulkCreate(data: BulkCreateData) {
  return apiService.post<Table[]>("/tables/bulk", data);
}

function update(data: Partial<Table> & { id: number }) {
  return apiService.put<Table>(`/tables/${data.id}`, data);
}

function remove(id: number | string) {
  return apiService.delete<Table>(`/tables/${id}`);
}

export const tablesService = { bulkCreate, update, remove, all };
