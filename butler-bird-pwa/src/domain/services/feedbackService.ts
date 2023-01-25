import { api } from "domain/services/apiService";
import { OrganizationFeedbackFormValues } from "pages/tables/[id]/feedback/organization";
import { AppFeedbackFormValues } from "components/feedback/AppFeedback";

export async function appFeedback(
  installation: string,
  values: AppFeedbackFormValues,
  accessToken?: string
) {
  const headers: { [header: string]: string } = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return api.post(
    "/feedback/system",
    {
      installation,
      ...values,
    },
    {
      headers,
    }
  );
}

export async function organizationFeedback(
  installation: string,
  values: OrganizationFeedbackFormValues,
  organization: number,
  accessToken?: string
) {
  const headers: { [header: string]: string } = {};
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return api.post(
    "/feedback/organization",
    {
      installation,
      organization,
      ...values,
    },
    {
      headers,
    }
  );
}
