import { createInstallationV2, deleteInstallation } from "domain/services/installationService";
import { v4 as uuidv4 } from "uuid";
import { Installation } from "domain/types/Installation";
import { LocalStorage } from "domain/util/localStorage";

export function getToken() {
  const savedInstallation = localStorage.getItem(LocalStorage.InstallationV2);
  if (savedInstallation) {
    const installation: Installation = JSON.parse(savedInstallation);
    return installation.uid;
  } else {
    return uuidv4();
  }
}

export function getInstallation(): Installation | undefined {
  const installation = localStorage.getItem(LocalStorage.InstallationV2);
  if (installation) {
    return JSON.parse(installation);
  }
}

function removeToken() {
  localStorage.removeItem(LocalStorage.InstallationV2);
}

const userIdentification = {
  init: async function () {
    try {
      const token = getToken();
      const installation = await createInstallationV2(token);
      localStorage.setItem(LocalStorage.InstallationV2, JSON.stringify(installation.data));
    } catch (error) {
      console.error(error);
    }
  },
  remove: async function () {
    try {
      const token = getToken();
      await deleteInstallation(token);
      removeToken();
    } catch (e) {
      console.error(e);
    }
  },
};

export { userIdentification };
