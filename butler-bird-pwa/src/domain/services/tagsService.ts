import { api } from "domain/services/apiService";
import { Tag } from "domain/types/Tag";

export async function getTags(organizationID: string | number) {
  return api.get<Tag[]>(`/tags?organization=${organizationID}`);
}
