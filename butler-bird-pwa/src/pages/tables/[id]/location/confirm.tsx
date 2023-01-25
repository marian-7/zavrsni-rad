import React, { memo, useCallback, useMemo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getDefaultPageProps, redirectToLogin } from "domain/serverSideProps";
import { useLoadMapScripts } from "hooks/useLoadMapScripts";
import Head from "next/head";
import { ConfirmDeliveryAddress } from "components/location/ConfirmDeliveryAddress";
import { Formik } from "formik";
import { useQuery } from "react-query";
import { Session } from "next-auth";
import { paths } from "paths";
import { Position } from "domain/types/Location";
import { useLocation } from "hooks/useLocation";
import { locationsService } from "domain/services/locationsService";
import { useTable } from "hooks/useTable";
import { useRouter } from "hooks/useRouter";

type Props = {
  session?: Session;
};

export type AddressPayload = {
  streetAddress: string;
  additionalInfo?: string;
  hereId: string;
  city?: string;
  position: Position;
  id?: number | string;
};

export type AddressForm = {
  address?: AddressPayload;
  additionalInfo?: string;
};

const ConfirmPage: NextPage<Props> = memo(function ConfirmPage() {
  const { allLoaded, handleSubmit, initialValues } = useConfirmPage();

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
      <Formik enableReinitialize onSubmit={handleSubmit} initialValues={initialValues}>
        {initialValues && <ConfirmDeliveryAddress allLoaded={allLoaded} location={initialValues} />}
      </Formik>
    </>
  );
});

function useConfirmPage() {
  const { allLoaded } = useLoadMapScripts();
  const { push } = useRouter();
  const { coordinates, setLocation } = useLocation();
  const { table } = useTable();

  const { data: location } = useQuery(
    "locationFromCoordinates",
    async () => {
      try {
        if (coordinates?.lat && coordinates.lng) {
          const res = await locationsService.reverseGeocoding(
            `${coordinates.lat},${coordinates.lng}`
          );
          const suggestion = res.data.items[0];

          return {
            address: {
              streetAddress: suggestion.title,
              hereId: suggestion.id,
              position: { ...suggestion.position },
            },
          };
        }
      } catch (error) {
        throw error;
      }
    },
    {
      enabled: !!coordinates,
    }
  );

  const initialValues = useMemo<AddressForm>(() => {
    if (location) {
      return { ...location, additionalInfo: "" };
    }
    return {
      additionalInfo: "",
    };
  }, [location]);

  const handleSubmit = useCallback(
    async (values: AddressForm) => {
      setLocation({ ...values.address, additionalInfo: values.additionalInfo });
      if (table) {
        await push(paths.finish(table.id), undefined, { preserveQuery: true });
      }
    },
    [push, setLocation, table]
  );

  return { allLoaded, handleSubmit, initialValues };
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

export default ConfirmPage;
