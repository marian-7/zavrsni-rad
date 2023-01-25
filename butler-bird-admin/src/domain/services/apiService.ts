import axios from "axios";
import { get } from "lodash";
import { paths, slugPath, withSlug } from "paths";
import { matchPath } from "react-router-dom";
import { storageService } from "domain/services/storageService";

export const apiService = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

apiService.interceptors.response.use(undefined, (err) => {
  const status = get(err, "response.status");
  if (status === 401 || status === 403) {
    const pathname = window.location.pathname;
    const path = matchPath<{ slug: string }>(pathname, slugPath(""));
    const slug = path?.params.slug;
    if (slug) {
      storageService.removeAccessToken(slug);
      window.location.href = withSlug(paths.login());
    }
  }
  return Promise.reject(err);
});
