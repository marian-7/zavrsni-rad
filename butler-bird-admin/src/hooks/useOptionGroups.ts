import { useQuery, useQueryClient } from "react-query";
import { optionGroupsService } from "domain/services/optionGroupsService";
import { mapData } from "domain/util/axios";
import { OptionGroup } from "domain/models/OptionGroup";

export function useOptionGroups() {
  const qc = useQueryClient();

  return useQuery("optionGroups", ({ queryKey }) => {
    return (
      qc.getQueryData<OptionGroup[]>(queryKey) ??
      optionGroupsService.findWithOrgAccessLevel().then(mapData)
    );
  });
}
