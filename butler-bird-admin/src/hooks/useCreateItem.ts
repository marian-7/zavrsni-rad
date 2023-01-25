import { useMutation, useQueryClient } from "react-query";
import { itemsService } from "domain/services/itemsService";
import { Item } from "domain/models/Item";
import { UseMutationOptions } from "react-query/types/react/types";
import { mapData } from "domain/util/axios";

export interface ItemContext {
  item?: Item;
  items?: Item[];
}

interface CreateItemArgs {
  data: Omit<Item, "id" | "categories" | "tags">;
  image?: File | null;
}

export function useCreateItem(
  options?: UseMutationOptions<Item, unknown, CreateItemArgs, ItemContext>
) {
  const qc = useQueryClient();

  return useMutation<Item, unknown, CreateItemArgs, ItemContext>(
    (data) => itemsService.createItem(data.data, data.image).then(mapData),
    {
      ...options,
      onError: (error, data, ctx) => {
        qc.setQueryData("items", ctx?.items);

        options?.onError?.(error, data, ctx);
      },
      onSuccess: (data, variables, ctx) => {
        qc.setQueryData<Item>(["items", data.id], data);

        qc.setQueryData<Item[]>("items", (old) => {
          if (!old) {
            return [data];
          }
          return old.concat([data]);
        });

        options?.onSuccess?.(data, variables, ctx);
      },
    }
  );
}
