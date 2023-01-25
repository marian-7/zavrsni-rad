import { api } from "domain/services/apiService";
import { Table } from "domain/types/Table";

export async function getTableById(id: string | number) {
  return api.get<Table>(`/app/table/${id}`).then((response) => {
    const data = response.data ? { ...response.data, id: Number(id) } : response.data;
    return { ...response, data };
  });
}
