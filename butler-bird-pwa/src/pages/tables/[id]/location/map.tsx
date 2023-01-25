import React, { memo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getDefaultPageProps, redirectToLogin } from "domain/serverSideProps";
import Head from "next/head";
import { SelectDeliveryAddress } from "components/location/SelectDeliveryAddress";
import { useLoadMapScripts } from "hooks/useLoadMapScripts";

type Props = {};

const MapPage: NextPage<Props> = memo(function MapPage() {
  const { allLoaded } = useMapPage();

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://js.api.here.com/v3/3.1/mapsjs-ui.css"
        />
        <title>Butler Bird</title>
      </Head>
      <SelectDeliveryAddress allLoaded={allLoaded} />
    </>
  );
});

function useMapPage() {
  const { allLoaded } = useLoadMapScripts();

  return { allLoaded };
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  await redirectToLogin(ctx);
  const props = await getDefaultPageProps(ctx, ["location", "common"]);
  return {
    props: {
      ...props,
    },
  };
}

export default MapPage;
