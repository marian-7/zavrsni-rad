import { useQuery, useQueryClient } from "react-query";
import { useCallback, useRef } from "react";
import { Item } from "domain/types/Item";
import { uniqueId } from "domain/util/uniqueId";
import { LocalOrder, LocalOrderItem } from "domain/types/Order";
import { LocalStorage } from "domain/util/localStorage";

export function useOrder() {
  const { current: key } = useRef("order");
  const queryClient = useQueryClient();

  const loadFromLocalStorage: () => LocalOrder = useCallback(() => {
    const savedOrder = localStorage.getItem(LocalStorage.Order);
    if (typeof savedOrder === "string") {
      return JSON.parse(savedOrder);
    }
  }, []);

  const { data: order } = useQuery(key, () => queryClient.getQueryData<LocalOrder>(key), {
    initialData: loadFromLocalStorage,
  });

  const addItem = useCallback(
    (item: Item, quantity: number, price: number, menuId: number) => {
      queryClient.setQueryData<LocalOrder>(key, (old) => {
        const orderItem: LocalOrderItem = { item, quantity, id: uniqueId(), price, menuId };
        if (!old) {
          return { items: [orderItem] };
        }
        return { ...old, items: old.items.concat([orderItem]) };
      });
    },
    [key, queryClient]
  );

  const removeItem = useCallback(
    (id: string) => {
      if (order) {
        const filteredItems = order.items.filter((item) => {
          return item.id !== id;
        });
        queryClient.setQueryData(key, {
          ...order,
          items: filteredItems,
        });
      }
    },
    [key, order, queryClient]
  );

  const editItem = useCallback(
    (editedItem: LocalOrderItem) => {
      if (order) {
        const updatedItems = [...order.items];
        const itemToEdit = order.items.findIndex((item) => {
          return item.id === editedItem.id;
        });
        updatedItems[itemToEdit] = editedItem;
        queryClient.setQueryData(key, {
          ...order,
          items: updatedItems,
        });
      }
    },
    [key, order, queryClient]
  );

  const clearOrder = useCallback(() => {
    queryClient.setQueryData(key, undefined);
  }, [key, queryClient]);

  const dumpInLocalStorage = useCallback(() => {
    localStorage.setItem(LocalStorage.Order, JSON.stringify(order));
  }, [order]);

  return {
    order,
    addItem,
    removeItem,
    editItem,
    clearOrder,
    dumpInLocalStorage,
    loadFromLocalStorage,
  };
}
