import { Venue } from "domain/models/Venue";
import { apiService } from "domain/services/apiService";
import { Typography } from "domain/models/Typography";

function all() {
  return apiService.get<Venue[]>("/venues?_limit=-1");
}

function get(id: string | number) {
  return apiService.get<Venue>(`/venues/${id}`);
}

export interface UpdateVenueData extends Partial<Venue> {
  id: number;
}

function update(data: UpdateVenueData) {
  return apiService.put<Venue>(`/venues/${data.id}`, data);
}

export interface CreateVenueData extends Partial<Omit<Venue, "id">> {
  name: Typography;
}

function create(data: CreateVenueData) {
  return apiService.post<Venue>("/venues", data);
}

function remove(id: number) {
  return apiService.delete<Venue>(`/venues/${id}`);
}

export const venuesService = { all, get, update, create, remove };
