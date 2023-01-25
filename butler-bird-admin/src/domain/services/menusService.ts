import { apiService } from "domain/services/apiService";
import { Menu } from "domain/models/Menu";

async function getMenus() {
  return apiService.get<Menu[]>("/menus?_limit=-1");
}
async function getMenu(menu: number | string) {
  return apiService.get<Menu>(`/menus/${menu}`);
}

async function createMenu(data: Partial<Menu>, image?: File) {
  if (image) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("files.image", image);
    return apiService.post<Menu>(`/menus`, formData);
  }
  return apiService.post<Menu>(`/menus`, data);
}

export interface UpdateMenuData extends Partial<Menu> {
  id: number;
}

async function updateMenu(data: UpdateMenuData, image?: File | null) {
  if (image) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("files.image", image);
    return apiService.put<Menu>(`/menus/${data.id}`, formData);
  }
  return apiService.put<Menu>(`/menus/${data.id}`, data);
}

function deleteMenu(id: number) {
  return apiService.delete<Menu>(`/menus/${id}`);
}

export const menusService = {
  getMenus,
  updateMenu,
  getMenu,
  createMenu,
  deleteMenu,
};
