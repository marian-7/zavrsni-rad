import { FC, memo } from "react";
import { Page } from "components/Page";
import { CustomRoute } from "components/CustomRoute";
import { paths, withSlug } from "paths";
import { OrderPage } from "pages/order/OrderPage";
import { OrderList } from "pages/orders/components/OrderList";

interface Props {}

const OrdersPage: FC<Props> = memo(function OrdersPage() {
  useOrdersPage();

  return (
    <Page>
      <OrderList />
      <CustomRoute path={withSlug(paths.order(), true)}>
        <OrderPage />
      </CustomRoute>
    </Page>
  );
});

function useOrdersPage() {}

export default OrdersPage;
