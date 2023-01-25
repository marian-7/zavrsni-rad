import React, { FC, memo, useCallback, useMemo, useState } from "react";
import style from "styles/pages/ordersTicketing/OrdersTicketing.module.scss";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { OrderTicket } from "pages/ordersTicketing/components/OrderTicket";
import { useQueryClient } from "react-query";
import { Order } from "domain/models/Order";
import Masonry from "react-masonry-component";
import { useLocation } from "react-router-dom";
import { OrderListHeader } from "pages/orders/components/OrderListHeader";
import { flatten, toNumber, uniqBy } from "lodash";
import { Filter, useWsOrder } from "hooks/useWsOrder";
import { useOrganization } from "hooks/useOrganization";
import queryString from "query-string";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteOrdersQuery } from "hooks/useInfiniteOrdersQuery";
import { showNotification } from "util/notifications";
import { OrderType } from "util/types";
import { updateOrdersOnEmit } from "queries/utils/order";

type Props = {};

export const OrdersTicketingPage: FC<Props> = memo(function OrdersTicketing() {
  const {
    t,
    orders,
    renderOrder,
    count,
    handleFetchNextPage,
    hasNextPage,
    setLocations,
    setVenues,
    setTables,
    setStatus,
    locations,
    venues,
    tables,
    status,
    type,
    setType,
  } = useOrdersTicketingPage();

  return (
    <div className={style.page}>
      <div className={style.container}>
        <Typography className={style.title}>
          {t("pages.ordersTicketing.title")}
        </Typography>
        <OrderListHeader
          spacingClassName={style.filters}
          containerClassName={style.filtersContainer}
          selectClassName={style.select}
          status={status}
          onStatusChange={setStatus}
          type={type}
          onTypeChange={setType}
          locations={locations}
          onLocationsChange={setLocations}
          venues={venues}
          onVenuesChange={setVenues}
          tables={tables}
          onTablesChange={setTables}
          loadingPlaceholder=""
        />
        <InfiniteScroll
          next={handleFetchNextPage}
          hasMore={hasNextPage!}
          loader={null}
          dataLength={count}
        >
          <Masonry options={{ transitionDuration: 0 }} className={style.orders}>
            {orders.map(renderOrder)}
          </Masonry>
        </InfiniteScroll>
      </div>
    </div>
  );
});

function useOrdersTicketingPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const organization = useOrganization();
  const qc = useQueryClient();

  const getArrayFromQuery = useCallback((value: string | string[] | null) => {
    if (typeof value === "string") {
      return value
        .split(",")
        .filter((v) => !!v)
        .map(toNumber);
    }
    return [];
  }, []);

  const query = queryString.parse(location.search);
  const initialLocations = getArrayFromQuery(query.locations);
  const initialVenues = getArrayFromQuery(query.venues);
  const initialTables = getArrayFromQuery(query.tables);
  const initialStatus = query.status ? toNumber(query.status) : undefined;
  const initialType =
    Object.values(OrderType).find((v) => v === query?.type) ?? OrderType.All;

  const [locations, setLocations] = useState<number[]>(initialLocations);
  const [venues, setVenues] = useState<number[]>(initialVenues);
  const [tables, setTables] = useState<number[]>(initialTables);
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState<OrderType>(initialType);

  const { data: listData, fetchNextPage, hasNextPage } = useInfiniteOrdersQuery(
    locations,
    venues,
    tables,
    status,
    type
  );

  const list = uniqBy(flatten(listData?.pages), "id") ?? [];
  const count = list.length;

  const renderOrder = (order: Order) => (
    <OrderTicket key={order.id} order={order} />
  );

  const handleFetchNextPage = useCallback(() => {
    return fetchNextPage();
  }, [fetchNextPage]);

  const handleSocket = useCallback(
    (order: Order) => {
      updateOrdersOnEmit(order, qc);
      showNotification();
    },
    [qc]
  );

  const filter = useMemo<Filter | undefined>(() => {
    if (!organization || !status) {
      return;
    }
    return {
      locations,
      tables,
      venues,
      status: status,
      organization: organization.id,
    };
  }, [locations, organization, status, tables, venues]);

  useWsOrder(handleSocket, filter);

  return {
    t,
    orders: list,
    count,
    renderOrder,
    handleFetchNextPage,
    hasNextPage,
    setLocations,
    setVenues,
    setTables,
    setStatus,
    locations,
    venues,
    tables,
    status,
    type,
    setType,
  };
}

export default OrdersTicketingPage;
