import { InfiniteData, useInfiniteQuery } from "react-query";
import { Order } from "domain/models/Order";
import { OrdersQueryKey } from "pages/orders/components/OrderList";
import { ordersService } from "domain/services/ordersService";
import { ORDERS_LIMIT } from "util/constants";
import { mapData } from "domain/util/axios";
import { chunk, flatten, uniqBy } from "lodash";
import { OrderType } from "util/types";

export function useInfiniteOrdersQuery(
  locations: number[],
  venues: number[],
  tables: number[],
  status: number | undefined,
  orderType: OrderType
) {
  return useInfiniteQuery<Order[], unknown, Order[], OrdersQueryKey>(
    ["orders", locations, venues, tables, status!, orderType],
    ({ pageParam = 1, queryKey }) => {
      const [, locations, venues, tables, status, orderType] = queryKey;
      let filter = "";
      if (status) {
        filter = `status=${status}`;
      }
      if (tables.length > 0) {
        filter += tables.map((t) => `&table_in=${t}`).join("");
      } else if (venues.length > 0) {
        filter += venues.map((v) => `&venue_in=${v}`).join("");
      } else if (locations.length > 0) {
        filter += locations.map((l) => `&location_in=${l}`).join("");
      }

      if (orderType !== OrderType.All) {
        filter += `&canceledAt_null=${orderType}`;
      }

      return ordersService
        .all(ORDERS_LIMIT * pageParam - ORDERS_LIMIT, filter)
        .then(mapData);
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage && lastPage.length === ORDERS_LIMIT) {
          return allPages.length + 1;
        }
      },
      enabled: !!status,
      select: (data: InfiniteData<Order[]>) => {
        const list = uniqBy(flatten(data.pages), "id") ?? [];
        const filteredList = list.filter((order) => order !== null);
        const pages = chunk(filteredList, ORDERS_LIMIT);
        return { pages: pages, pageParams: data.pageParams };
      },
    }
  );
}
