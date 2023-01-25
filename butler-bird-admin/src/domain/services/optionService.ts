import { Option } from "domain/models/OptionGroup";
import { apiService } from "domain/services/apiService";

export interface CreateOptionData extends Omit<Option, "id"> {}

function create(data: CreateOptionData) {
  return apiService.post<Option & { id: number }>("/item-options", data);
}

export interface UpdateOptionData extends Partial<Option> {
  id: number;
}

function update(data: UpdateOptionData) {
  return apiService.put<Option & { id: number }>(
    `/item-options/${data.id}`,
    data
  );
}

function remove(id: number) {
  return apiService.delete(`/item-options/${id}`);
}

export const optionService = { create, update, remove };
