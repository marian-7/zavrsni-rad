import { apiService } from "domain/services/apiService";
import { Location, SearchSuggestion } from "domain/models/Location";
import { SearchQuery } from "components/locationForm/LocationMap";
import axios from "axios";

function all() {
  return apiService.get<Location[]>("/locations?_limit=-1");
}

function getLocation(id: number | string) {
  return apiService.get<Location>(`/locations/${id}`);
}

function deleteLocation(id: number | string) {
  return apiService.delete<Location>(`/locations/${id}`);
}

function createLocation(data: Omit<Location, "id" | "venues">) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return apiService.post<Location>("/locations", formData);
}

export interface UpdateLocationData extends Partial<Location> {
  id: number;
}

function updateLocation(data: UpdateLocationData) {
  return apiService.put<Location>(`/locations/${data.id}`, data);
}

export interface HereAutocompleteResponse {
  items: SearchSuggestion[];
  queryTerms: any[];
}

function searchLocation(data: SearchQuery) {
  const { REACT_APP_HERE_MAP_API_KEY } = process.env;
  return axios.get<HereAutocompleteResponse>(
    `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${data.at}&limit=5&q=${data.query}&apiKey=${REACT_APP_HERE_MAP_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

export const locationsService = {
  all,
  getLocation,
  deleteLocation,
  createLocation,
  updateLocation,
  searchLocation,
};
