import { RequestPolicy } from "util/types";
import { useQuery, useQueryClient } from "react-query";
import { mapData } from "domain/util/axios";
import { menusService } from "domain/services/menusService";
import { Menu } from "domain/models/Menu";

export function useQueryMenus(rp?: RequestPolicy) {
  const qc = useQueryClient();

  return useQuery("menus", ({ queryKey }) => {
    let data: Menu[] | undefined;
    if (rp === RequestPolicy.CacheFirst) {
      data = qc.getQueryData(queryKey);
    }

    return data ?? menusService.getMenus().then(mapData);
  });
}
