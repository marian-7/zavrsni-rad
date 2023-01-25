const ACCESS_TOKEN = "access-token";

function getAccessToken(slug: string) {
  return localStorage.getItem(`${ACCESS_TOKEN}_${slug}`);
}

function setAccessToken(slug: string, value: string) {
  return localStorage.setItem(`${ACCESS_TOKEN}_${slug}`, value);
}

function removeAccessToken(slug: string) {
  localStorage.removeItem(`${ACCESS_TOKEN}_${slug}`);
}

export const storageService = {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
};
