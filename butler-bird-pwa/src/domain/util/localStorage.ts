import { getInstallation } from "domain/services/userIdentification";

export enum LocalStorage {
  Order = "order",
  Installation = "installation",
  InstallationV2 = "installation_v2",
}

export function modifyInstallation(notificationPreference: string, value?: string) {
  const installation = getInstallation();
  if (installation) {
    if (notificationPreference === "email") {
      installation.email = value;
      installation.izooto = null;
    } else {
      installation.izooto = value;
      installation.email = null;
    }
    localStorage.setItem(LocalStorage.InstallationV2, JSON.stringify(installation));
    return installation;
  }
}
