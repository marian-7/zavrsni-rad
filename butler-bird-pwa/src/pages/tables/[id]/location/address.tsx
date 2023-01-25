import React, { memo, useCallback } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { getDefaultPageProps, redirectToLogin } from "domain/serverSideProps";
import { AddNewAddress } from "components/location/AddNewAddress";
import { Formik } from "formik";
import { Session } from "next-auth";
import { Position } from "domain/types/Location";
import { useLoadMapScripts } from "hooks/useLoadMapScripts";
import { addressConfirmationSchema } from "domain/util/validation";
import { paths } from "paths";
import { useLocation } from "hooks/useLocation";
import { useTable } from "hooks/useTable";
import { useRouter } from "hooks/useRouter";

type Props = {
  session: Session;
};

export type AddressPayload = {
  streetAddress: string;
  additionalInfo?: string;
  hereId: string;
  city?: string;
  position: Position;
};

export type AddressForm = {
  address?: AddressPayload;
  additionalInfo: string;
};

const initialValues: AddressForm = {
  additionalInfo: "",
};

const Address: NextPage<Props> = memo(function Address() {
  const { allLoaded, handleSubmit } = useAddress();

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

      <>
        {allLoaded && (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={addressConfirmationSchema}
            validateOnMount
          >
            <AddNewAddress />
          </Formik>
        )}
      </>
    </>
  );
});

function useAddress() {
  const { allLoaded } = useLoadMapScripts();
  const { push } = useRouter();
  const { setLocation } = useLocation();
  const { table } = useTable();

  const handleSubmit = useCallback(
    async (values: AddressForm) => {
      setLocation({ ...values.address, additionalInfo: values.additionalInfo });
      if (table) {
        await push(paths.finish(table.id), undefined, { preserveQuery: true });
      }
    },
    [push, setLocation, table]
  );

  return { allLoaded, handleSubmit };
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

export default Address;
