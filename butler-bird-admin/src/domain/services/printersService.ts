import { apiService } from "domain/services/apiService";
import { Printer } from "domain/models/Printer";

function getAll() {
  return apiService.get<Printer[]>("/printers?_limit=-1");
}

function getOne(id: number | string) {
  return apiService.get<Printer>(`/printers/${id}`);
}

export interface CreatePrinterData
  extends Partial<Omit<Printer, "id" | "serialNumber">> {
  serialNumber: string;
}

function create(data: CreatePrinterData) {
  return apiService.post<Printer>("/printers", data);
}

export interface UpdatePrinterData extends Partial<Omit<Printer, "id">> {
  id: number;
}

function update(data: UpdatePrinterData) {
  return apiService.put<Printer>(`/printers/${data.id}`, data);
}

function remove(id: string | number) {
  return apiService.delete(`/printers/${id}`);
}

export const printersService = { create, getAll, getOne, update, remove };
