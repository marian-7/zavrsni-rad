import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { List } from "components/List";
import { OrderListHeader } from "pages/orders/components/OrderListHeader";
import listStyle from "styles/components/List.module.scss";
import style from "styles/components/List.module.scss";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Overflow } from "components/Overflow";
import { OrderListItem } from "pages/orders/components/OrderListItem";
import { useTranslation } from "react-i18next";
import InfiniteLoader from "react-window-infinite-loader";
import { QueryClient, useQueryClient } from "react-query";
import { Order } from "domain/models/Order";
import { chunk, flatten, uniqBy } from "lodash";
import { ORDERS_LIMIT } from "util/constants";
import { useOrganization } from "hooks/useOrganization";
import { useHistory } from "react-router-dom";
import { paths, withSlug } from "paths";
import { ReactComponent as TicketIcon } from "assets/icons/ticket.svg";
import { Typography } from "@material-ui/core";
import { Filter, useWsOrder } from "hooks/useWsOrder";
import { useInfiniteOrdersQuery } from "hooks/useInfiniteOrdersQuery";
import { showNotification } from "util/notifications";
import { OrderType } from "util/types";
import { useOrderStatuses } from "hooks/useOrderStatuses";

interface Props {}

export type OrdersQueryKey = [
  string,
  number[],
  number[],
  number[],
  number,
  OrderType
];

export const OrderList: FC<Props> = memo(function OrderList() {
  const {
    list,
    itemKey,
    renderItem,
    handleFetchNextPage,
    hasNextPage,
    count,
    setStatus,
    status,
    locations,
    setLocations,
    venues,
    setVenues,
    tables,
    setTables,
    type,
    setType,
    ordersTicketsLink,
  } = useOrderList();
  const { t } = useTranslation();

  return (
    <List
      title={t("pages.orders.title")}
      listHeader={
        <OrderListHeader
          spacingClassName="pv-3 ph-2"
          containerClassName={style.filtersContainer}
          selectClassName={style.select}
          status={status}
          onStatusChange={setStatus}
          locations={locations}
          onLocationsChange={setLocations}
          venues={venues}
          onVenuesChange={setVenues}
          tables={tables}
          onTablesChange={setTables}
          type={type}
          onTypeChange={setType}
        />
      }
      replaceBody
      orderTicketsLink={
        <a
          href={ordersTicketsLink}
          target="_blank"
          rel="noreferrer"
          className={style.orderTickets}
        >
          <TicketIcon className={style.ticket} />
          <Typography className={style.label}>
            {t("pages.orders.orderTickets")}
          </Typography>
        </a>
      }
    >
      <div className={listStyle.body}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <InfiniteLoader
                isItemLoaded={(index) => !hasNextPage || index < count}
                itemCount={hasNextPage ? count + 1 : count}
                loadMoreItems={handleFetchNextPage}
                threshold={ORDERS_LIMIT}
                minimumBatchSize={ORDERS_LIMIT}
              >
                {({ onItemsRendered, ref }) => (
                  <FixedSizeList
                    itemKey={itemKey}
                    itemData={list}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    outerElementType={Overflow}
                    height={height}
                    itemCount={count}
                    itemSize={94}
                    width={width}
                  >
                    {renderItem}
                  </FixedSizeList>
                )}
              </InfiniteLoader>
            );
          }}
        </AutoSizer>
      </div>
    </List>
  );
});

function useOrderList() {
  const organization = useOrganization();
  const { data: orderStatuses } = useOrderStatuses();
  const takeoutStatuses =
    orderStatuses?.filter((status) => status.type === "takeout") ?? [];
  const [status, setStatus] = useState(
    organization?.initialOrderStatus?.id ?? takeoutStatuses[0]?.id
  );
  const [locations, setLocations] = useState<number[]>([]);
  const [venues, setVenues] = useState<number[]>([]);
  const [tables, setTables] = useState<number[]>([]);
  const [type, setType] = useState(OrderType.All);
  const qc = useQueryClient();
  const { push } = useHistory();

  const { data: listData, fetchNextPage, hasNextPage } = useInfiniteOrdersQuery(
    locations,
    venues,
    tables,
    status!,
    type
  );

  const list = useMemo(() => uniqBy(flatten(listData?.pages), "id") ?? [], [
    listData?.pages,
  ]);
  const count = list.length;

  function itemKey(index: number, data: Order[]) {
    return data[index]?.id;
  }

  const renderItem = ({
    style,
    index,
    data,
  }: ListChildComponentProps<Order[]>) => {
    return <OrderListItem style={style} order={data[index]} />;
  };

  function handleFetchNextPage() {
    return fetchNextPage();
  }

  const handleSocket = useCallback(
    (order: Order) => {
      addOrder(qc, order);
      showNotification(() => push(withSlug(paths.order(order.id))));
    },
    [push, qc]
  );

  const filter = useMemo<Filter | undefined>(() => {
    if (!status) {
      return;
    }
    return {
      locations,
      tables,
      venues,
      status: status,
      organization: organization!?.id,
    };
  }, [locations, organization, status, tables, venues]);

  useWsOrder(handleSocket, filter);

  const ordersTicketsLink = useMemo(() => {
    let query = "";
    if (locations.length > 0) {
      query += `locations=${locations}`;
    }
    if (venues.length > 0) {
      query += `&venues=${venues}`;
    }
    if (tables.length > 0) {
      query += `&tables=${tables}`;
    }
    if (status) {
      query += `&status=${status}`;
    }
    if (type) {
      query += `&type=${type}`;
    }
    return `${withSlug(paths.ordersTicketing())}?${query}`;
  }, [locations, status, tables, type, venues]);

  return {
    list,
    itemKey,
    renderItem,
    handleFetchNextPage,
    hasNextPage,
    count,
    setStatus,
    status,
    locations,
    setLocations,
    venues,
    setVenues,
    tables,
    setTables,
    type,
    setType,
    ordersTicketsLink,
  };
}

function addOrder(qc: QueryClient, order: Order) {
  qc.getQueryCache()
    .findAll()
    .filter((query) => {
      const key = query.queryKey;
      if (!Array.isArray(key)) {
        return false;
      }
      return key[0] === "orders" && key.length === 6;
    })
    .forEach((query) => {
      const data = query.state.data as { pages: Order[][] };
      let orders = flatten(data.pages);

      if (shouldUpdateQuery(query.queryKey as OrdersQueryKey, order)) {
        const pages = chunk(orders, ORDERS_LIMIT);
        pages[0] = [order].concat(pages[0]);
        const pageParams = pages.map((_, i) => i + 1);
        qc.setQueryData(query.queryKey, { pages, pageParams });
      }
    });
}

function shouldUpdateQuery(qk: OrdersQueryKey, order: Order) {
  const [, locations, venues, tables, status] = qk;

  if (status !== order.status) {
    return false;
  }
  if (tables.length > 0) {
    return tables.includes(order.table);
  }
  if (venues.length > 0) {
    return venues.includes(order.venue);
  }
  if (locations.length > 0) {
    return locations.includes(order.location);
  }
  return true;
}
