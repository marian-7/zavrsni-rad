import { apiService } from "./apiService";
import { User } from "../models/User";
import { ResetPasswordFormValues } from "../../pages/reset/components/ResetPasswordForm";

export interface LoginResponse {
  jwt: string;
  user: User;
}

function login(identifier: string, password: string) {
  return apiService.post<LoginResponse>("/auth/local", {
    identifier,
    password,
  });
}

function me() {
  return apiService.get<User>("/users/me");
}

function forgottenPassword(email: string) {
  return apiService.post("/auth/forgot-password", {
    email,
  });
}

function resetPassword(data: ResetPasswordFormValues & { code: string }) {
  return apiService.post("/auth/reset-password", data);
}

export const userService = {
  login,
  me,
  forgottenPassword,
  resetPassword,
};
