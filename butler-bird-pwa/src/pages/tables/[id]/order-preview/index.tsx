import React, { memo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getDefaultPageProps, getServerSideTableProps } from "domain/serverSideProps";
import { useRouter } from "next/router";
import { withCurrencyProvider } from "components/hoc/withCurrencyProvider";
import { OrderPreview } from "components/order/OrderPreview";
import { Session } from "next-auth";
import { getProviders } from "next-auth/client";
import { AppProvider } from "next-auth/providers";

type Props = {
  session: Session;
  providers: Record<string, AppProvider>;
};

const OrderPreviewPage: NextPage<Props> = memo(function OrderPreviewPage({ session, providers }) {
  useOrderPreviewPage();
  const { back } = useRouter();

  return <OrderPreview goBack={back} session={session} providers={providers} />;
});

function useOrderPreviewPage() {}

export default withCurrencyProvider(OrderPreviewPage);

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, [
    "common",
    "orderPreview",
    "success",
    "table",
    "menu",
    "login",
  ]);
  const providers = await getProviders();
  await getServerSideTableProps(ctx);
  return { props: { ...props, providers } };
}
