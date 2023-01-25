import { apiService } from "domain/services/apiService";
import { Category } from "domain/models/Category";

async function getCategories() {
  return apiService.get<Category[]>("/categories?_limit=-1");
}

async function getCategory(id: number | string) {
  return apiService.get<Category>(`/categories/${id}`);
}

function createCategory(data: Partial<Category>, image?: File) {
  if (image) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("files.image", image);
    return apiService.post<Category>(`/categories`, formData);
  }
  return apiService.post<Category>(`/categories`, data);
}

export interface UpdateCategoryData extends Partial<Category> {
  id: number;
}

function updateCategory(data: UpdateCategoryData, image?: File | null) {
  if (image) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("files.image", image);
    return apiService.put<Category>(`/categories/${data.id}`, formData);
  }
  return apiService.put<Category>(`/categories/${data.id}`, data);
}

function deleteCategory(id: number) {
  return apiService.delete<Category>(`/categories/${id}`);
}

export const categoriesService = {
  getCategories,
  getCategory,
  updateCategory,
  createCategory,
  deleteCategory,
};
