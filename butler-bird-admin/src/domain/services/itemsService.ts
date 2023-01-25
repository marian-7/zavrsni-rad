import { apiService } from "domain/services/apiService";
import { Item } from "domain/models/Item";

function getItems() {
  return apiService.get<Item[]>("/v2/items?_limit=-1");
}

function getItem(id: number | string) {
  return apiService.get<Item>(`/v2/items/${id}`);
}

function createItem(
  data: Omit<Item, "id" | "categories" | "tags">,
  image?: File | null
) {
  if (image) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("files.image", image);
    return apiService.post<Item>(`/v2/items`, formData);
  }
  return apiService.post<Item>(`/v2/items`, data);
}

export interface UpdateItemData extends Partial<Item> {
  id?: number;
}

function updateItem(data: UpdateItemData, image?: File | null) {
  if (image) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("files.image", image);
    return apiService.put<Item>(`/v2/items/${data.id}`, formData);
  }
  return apiService.put<Item>(`/v2/items/${data.id}`, data);
}

function deleteItem(id: number) {
  return apiService.delete<Item>(`/v2/items/${id}`);
}

export interface AddTagsData extends Partial<Item> {
  id: number;
  tags: number[];
}

function addTags(data: AddTagsData) {
  return apiService.put<Item>(`/items/tags/${data.id}`, data);
}

export const itemsService = {
  getItems,
  getItem,
  updateItem,
  deleteItem,
  createItem,
  addTags,
};
