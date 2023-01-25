import { OptionGroup, Option, AccessLevel } from "domain/models/OptionGroup";
import { apiService } from "domain/services/apiService";

export interface CreateOptionGroupData extends Omit<OptionGroup, "id"> {}

function findWithOrgAccessLevel() {
  return apiService.get<OptionGroup[]>(
    `/item-groups?accessLevel_eq=${AccessLevel.Organization}`
  );
}

function create(data: CreateOptionGroupData) {
  return apiService.post("/item-groups", data);
}

export interface UpdateOptionGroupData
  extends Omit<Partial<OptionGroup>, "options" | "id"> {
  id: number;
  options: Omit<Option, "id">[];
}

function update(data: UpdateOptionGroupData) {
  return apiService.put<OptionGroup>(`/item-groups/${data.id}`, data);
}

export const optionGroupsService = { create, update, findWithOrgAccessLevel };
