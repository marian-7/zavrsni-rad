import { api } from "domain/services/apiService";
import { Installation } from "domain/types/Installation";

export async function createInstallation(pushToken: string) {
  return api.post<Installation>("/installations", {
    pushToken,
  });
}

export async function createInstallationV2(pushToken: string) {
  return api.post("/v2/installations", {
    pushToken,
  });
}

export async function deleteInstallation(uuid: string | number) {
  return api.delete(`/v2/installations/${uuid}`);
}
