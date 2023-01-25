import { QueryClient, useMutation, useQueryClient } from "react-query";
import { itemsService, UpdateItemData } from "domain/services/itemsService";
import { Item } from "domain/models/Item";
import { ItemContext } from "./useCreateItem";
import { mapData } from "domain/util/axios";
import { UseMutationOptions } from "react-query/types/react/types";

interface UpdateItemArgs {
  data: UpdateItemData;
  image?: File | null;
}

export function useItemUpdate(
  options?: UseMutationOptions<Item, unknown, UpdateItemArgs, ItemContext>
) {
  const qc = useQueryClient();
  return useMutation<Item, unknown, UpdateItemArgs, ItemContext>(
    (data) => itemsService.updateItem(data.data, data.image).then(mapData),
    {
      ...options,
      onSuccess: (data, variables, ctx) => {
        handleItemUpdateSuccess(data, qc);
        options?.onSuccess?.(data, variables, ctx);
      },
    }
  );
}

export function handleItemUpdateSuccess(data: Item, qc: QueryClient) {
  qc.setQueryData<Item | undefined>(["items", data.id], data);
  qc.setQueryData<Item[] | undefined>("items", (prev) => {
    return prev?.map((item) => (item.id === data.id ? data : item));
  });
}
