import axios from "axios";
import { SearchSuggestion } from "domain/types/Location";

export interface SearchQuery {
  query: string;
  at: string;
}

export interface HereAutocompleteResponse {
  items: SearchSuggestion[];
  queryTerms: any[];
}

export interface HereReverseGeocodingResponse {
  items: SearchSuggestion[];
}

function suggestions(data: SearchQuery) {
  const { NEXT_PUBLIC_HERE_MAPS_API_KEY } = process.env;
  return axios.get<HereAutocompleteResponse>(
    `https://autosuggest.search.hereapi.com/v1/autosuggest?at=${data.at}&limit=5&q=${data.query}&apiKey=${NEXT_PUBLIC_HERE_MAPS_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

function reverseGeocoding(latLng: string) {
  const { NEXT_PUBLIC_HERE_MAPS_API_KEY } = process.env;
  return axios.get<HereReverseGeocodingResponse>(
    `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latLng}&lang=en-US&apiKey=${NEXT_PUBLIC_HERE_MAPS_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

export function getStaticMap(latLng: string) {
  const { NEXT_PUBLIC_HERE_MAPS_API_KEY } = process.env;
  return `https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=${NEXT_PUBLIC_HERE_MAPS_API_KEY}&c=${latLng}&z=16&w=750&h=750`;
}

export const locationsService = {
  suggestions,
  reverseGeocoding,
};
