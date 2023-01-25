import React, { memo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getDefaultPageProps, redirectToLogin } from "domain/serverSideProps";
import { UserLocationList } from "components/location/UserLocationList";
import { UserProvider } from "providers/UserProvider";

type Props = {};

const LocationsList: NextPage<Props> = memo(function LocationsList() {
  useLocationsList();

  return (
    <UserProvider>
      <UserLocationList />
    </UserProvider>
  );
});

function useLocationsList() {}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  await redirectToLogin(ctx);
  const props = await getDefaultPageProps(ctx, ["location", "common"]);
  return {
    props: {
      ...props,
    },
  };
}

export default LocationsList;
