import { apiService } from "domain/services/apiService";

export interface AcceptData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

function accept(data: AcceptData) {
  return apiService.post("/user-invitations/accept", data);
}

export const staffService = { accept };
