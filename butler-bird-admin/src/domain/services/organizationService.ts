import { apiService } from "./apiService";
import { Organization, Staff } from "../models/Organization";

function getOrganization(slug: string) {
  return apiService.get<Organization>(`organizations/${slug}`);
}

export interface UpdateOrganizationData
  extends Partial<Omit<Organization, "logo">> {
  id: number;
  logo?: null;
}

function update(data: UpdateOrganizationData, logo?: File | null) {
  if (logo) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("files.logo", logo);
    return apiService.put<Organization>(`/organizations/${data.id}`, formData);
  }
  return apiService.put<Organization>(`/organizations/${data.id}`, data);
}

function invite(email: string) {
  return apiService.post<Staff>(`/staff`, { email });
}

export const organizationService = {
  getOrganization,
  update,
  invite,
};
