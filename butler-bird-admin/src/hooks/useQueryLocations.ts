import { RequestPolicy } from "util/types";
import { useQuery, useQueryClient } from "react-query";
import { locationsService } from "domain/services/locationsService";
import { mapData } from "domain/util/axios";
import { Location } from "domain/models/Location";

export function useQueryLocations(rp?: RequestPolicy) {
  const qc = useQueryClient();

  return useQuery("locations", ({ queryKey }) => {
    let data: Location[] | undefined;
    if (rp === RequestPolicy.CacheFirst) {
      data = qc.getQueryData(queryKey);
    }

    return data ?? locationsService.all().then(mapData);
  });
}
