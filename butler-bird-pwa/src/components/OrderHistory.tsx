import React, { FC, memo, useCallback, useMemo } from "react";
import { Dialog } from "./Dialog";
import { Steps } from "components/NavigationDialog";
import { useTranslation } from "next-i18next";
import { OrderHistoryItem } from "components/OrderHistoryItem";
import style from "styles/components/order-history.module.scss";
import { useInfiniteQuery } from "react-query";
import { getOrderHistory } from "domain/services/orderService";
import { OrderHistory as OrderHistoryType } from "domain/types/OrderHistory";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { uniqBy, flatten } from "lodash";
import AutoSizer from "react-virtualized-auto-sizer";
import { ORDER_HISTORY_LIMIT } from "domain/util/const";
import { getToken } from "domain/services/userIdentification";
import { useRouter } from "next/router";
import { Session } from "next-auth";

type Props = {
  handleNavigation: (orderId: number) => void;
  isOpen: boolean;
  handleOrderHistoryItem: (item: OrderHistoryType) => void;
  session: Session;
};

export const OrderHistory: FC<Props> = memo(function OrderHistory(props) {
  const {
    handleBack,
    orderHistory,
    hasNextPage,
    handleFetchNextPage,
    itemKey,
    goToOrderDetails,
  } = useOrderHistory(props);
  const { isOpen } = props;
  const { t } = useTranslation("common");

  const renderItem = ({ index, data, style }: ListChildComponentProps<OrderHistoryType[]>) => (
    <OrderHistoryItem
      order={data[index]}
      fixedListItemStyle={style}
      goToOrderDetails={goToOrderDetails}
    />
  );

  return (
    <Dialog
      open={isOpen}
      onBack={handleBack}
      backText={t("button.backToMyProfile")}
      containerClassName={style.container}
    >
      <AutoSizer>
        {({ height, width }) => {
          return (
            <InfiniteLoader
              isItemLoaded={(index) => {
                return !hasNextPage || index < orderHistory.length;
              }}
              loadMoreItems={handleFetchNextPage}
              itemCount={hasNextPage ? orderHistory.length + 1 : orderHistory.length}
              threshold={ORDER_HISTORY_LIMIT}
              minimumBatchSize={ORDER_HISTORY_LIMIT}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  itemSize={146}
                  height={height}
                  itemCount={orderHistory.length}
                  width={width}
                  ref={ref}
                  onItemsRendered={onItemsRendered}
                  itemData={orderHistory}
                  itemKey={itemKey}
                >
                  {renderItem}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          );
        }}
      </AutoSizer>
    </Dialog>
  );
});

function useOrderHistory(props: Props) {
  const { handleNavigation, handleOrderHistoryItem, session } = props;
  const { back, query } = useRouter();

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["orderHistory"],
    async ({ pageParam = 1 }) => {
      try {
        const token = getToken();
        const res = await getOrderHistory(token, pageParam, session.accessToken);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === ORDER_HISTORY_LIMIT) {
          return allPages.length + 1;
        }
      },
      enabled: query.modal === Steps.OrderHistory,
    }
  );

  function itemKey(index: number, data: OrderHistoryType[]) {
    return data[index].id;
  }

  const orderHistory = useMemo(() => {
    return uniqBy(flatten(data?.pages), "id") ?? [];
  }, [data]);

  const handleFetchNextPage = useCallback(() => {
    return fetchNextPage();
  }, [fetchNextPage]);

  const goToOrderDetails = useCallback(
    (orderHistoryItem: OrderHistoryType) => {
      handleNavigation(orderHistoryItem.id);
      handleOrderHistoryItem(orderHistoryItem);
    },
    [handleNavigation, handleOrderHistoryItem]
  );

  return {
    handleBack,
    orderHistory,
    hasNextPage,
    handleFetchNextPage,
    itemKey,
    goToOrderDetails,
  };
}
