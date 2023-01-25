import { apiService } from "domain/services/apiService";
import { Tag } from "domain/models/Tag";
import { Typography } from "domain/models/Typography";

function all() {
  return apiService.get<Tag[]>("/tags?_limit=-1");
}

function getTags(itemId?: string | number) {
  const query = itemId ? `?item=${itemId}` : "";
  return apiService.get<Tag[]>(`/tags${query}`);
}

export interface CreateTagData extends Partial<Omit<Tag, "id">> {
  name: Typography;
}

function createTag(data: CreateTagData) {
  return apiService.post<Tag>(`/tags`, data);
}

export interface UpdateTagData extends Partial<Tag> {
  id: number;
}

function updateTag(data: UpdateTagData) {
  return apiService.put<Tag>(`/tags/${data.id}`, data);
}

function deleteTag(id: number) {
  return apiService.delete<Tag>(`/tags/${id}`);
}

export const tagsService = {
  all,
  getTags,
  updateTag,
  createTag,
  deleteTag,
};
