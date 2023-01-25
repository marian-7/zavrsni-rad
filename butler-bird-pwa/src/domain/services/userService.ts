import { api } from "domain/services/apiService";
import { UserAddress } from "domain/types/Location";
import { AddressPayload } from "pages/tables/[id]/location/address";

export function deleteUserProfile(accessToken: string) {
  return api.delete(`/app/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUserAddresses(accessToken?: string) {
  return api.get(`/user-addresses`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createUserAddress(address: AddressPayload) {
  return api.post(`/user-addresses/`, { ...address });
}

export function getUserAddress(accessToken: string, id: string | number) {
  return api.get<UserAddress>(`/user-addresses/${id}`);
}

export function updateUserAddress(accessToken: string, id: string | number, address: UserAddress) {
  return api.put(`/user-addresses/${id}`, {
    ...address,
  });
}

export function deleteUserAddress(accessToken: string, id: string | number) {
  return api.delete(`/user-addresses/${id}`);
}
