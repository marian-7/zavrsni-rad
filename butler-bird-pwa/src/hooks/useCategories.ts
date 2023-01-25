import { useQuery, useQueryClient } from "react-query";
import { getCategoriesByMenu } from "domain/services/menuService";

export function useCategories(menuId?: string) {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery(
    ["categories", menuId],
    ({ queryKey }) => {
      const [, id] = queryKey;
      if (id) {
        return (
          queryClient.getQueryData(queryKey) ?? getCategoriesByMenu(id).then((data) => data.data)
        );
      }
    },
    { enabled: !!menuId }
  );

  return { categories };
}
