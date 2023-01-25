import { useQuery, useQueryClient } from "react-query";
import { organizationService } from "domain/services/organizationService";
import { matchPath, useLocation, useParams } from "react-router-dom";
import { slugPath } from "paths";

export function useOrganizationQuery() {
  const qc = useQueryClient();
  const { pathname } = useLocation();
  const match = matchPath<{ slug: string }>(pathname, slugPath(""));
  const params = useParams<{ slug: string }>();
  const id = params.slug ?? match?.params.slug;

  return useQuery(["organizations", id], ({ queryKey }) => {
    const [, id] = queryKey;
    if (id) {
      return (
        qc.getQueryData(queryKey) ??
        organizationService.getOrganization(id).then(({ data }) => data)
      );
    }
  });
}
