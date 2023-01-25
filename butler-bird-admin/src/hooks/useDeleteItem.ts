import { useMutation, useQueryClient } from "react-query";
import { Item } from "../domain/models/Item";
import { ItemContext } from "./useCreateItem";
import { itemsService } from "../domain/services/itemsService";
import { mapData } from "../domain/util/axios";
import { UseMutationOptions } from "react-query/types/react/types";

export function useDeleteItem(
  options?: UseMutationOptions<Item, unknown, number, ItemContext>
) {
  const qc = useQueryClient();

  return useMutation<Item, unknown, number, ItemContext>(
    (id) => itemsService.deleteItem(id).then(mapData),
    {
      onMutate: (id) => {
        let items: Item[] | undefined;

        qc.setQueryData<Item[]>("items", (old) => {
          items = old;
          return old?.filter((i) => i.id !== id) ?? [];
        });

        options?.onMutate?.(id);

        return { items };
      },
      onError: (error, data, ctx) => {
        qc.setQueryData("items", ctx?.items);

        options?.onError?.(error, data, ctx);
      },
      onSuccess: (data, variables, ctx) => {
        qc.setQueryData<Item[]>("items", (old) => {
          return old?.filter((i) => i.id !== data.id) ?? [];
        });

        options?.onSuccess?.(data, variables, ctx);
      },
    }
  );
}
