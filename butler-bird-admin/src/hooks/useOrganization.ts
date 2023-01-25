import { useContext } from "react";
import { OrganizationContext } from "pages/organization/OrganizationPage";

export function useOrganization() {
  return useContext(OrganizationContext);
}
