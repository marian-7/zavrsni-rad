import { api } from "domain/services/apiService";
import { Category } from "domain/types/Category";

export async function getCategoriesByMenu(id: string | number) {
  return api.get<Category[]>(`/app/categories-by-menu/${id}`);
}
