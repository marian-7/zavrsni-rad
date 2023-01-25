import { memo, useCallback, useMemo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { AddressDetails } from "components/location/AddressDetails";
import { getDefaultPageProps, redirectToLogin } from "domain/serverSideProps";
import { Session } from "next-auth";
import { useMutation, useQueryClient } from "react-query";
import { createUserAddress } from "domain/services/userService";
import { AddressPayload } from "pages/tables/[id]/location/confirm";
import { Formik } from "formik";
import { useLocation } from "hooks/useLocation";
import { Loading } from "components/Loading";
import { useTranslation } from "next-i18next";
import { paths } from "paths";
import { useTable } from "hooks/useTable";
import { useRouter } from "hooks/useRouter";

type Props = {
  session?: Session;
};

type AddressForm = {
  address?: AddressPayload;
  additionalInfo?: string;
  deliveryInstructions?: string;
};

const Finish: NextPage<Props> = memo(function Confirm({ session }) {
  const { handleSubmit, initialValues, isLoading } = useConfirm();
  const { t } = useTranslation("location");

  return (
    <>
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <AddressDetails showDoneButton={true} session={session} />
      </Formik>
      <Loading label={t("processingAddress")} isLoading={isLoading} />
    </>
  );
});

function useConfirm() {
  const queryClient = useQueryClient();
  const { location } = useLocation();
  const { push } = useRouter();
  const { table } = useTable();

  const { mutate, isLoading } = useMutation(
    async (values: AddressForm) => {
      try {
        const { additionalInfo, address, deliveryInstructions } = values;
        if (address) {
          const payload = {
            ...address,
            additionalInfo,
            deliveryInstructions,
          };
          const res = await createUserAddress(payload);
          return res.data;
        }
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData("locations", { ...res });
      },
    }
  );

  const initialValues = useMemo<AddressForm>(() => {
    if (location) {
      return {
        address: { ...location },
        additionalInfo: location.additionalInfo,
        deliveryInstructions: location.deliveryInstructions ?? "",
      };
    }
    return {
      deliveryInstructions: "",
      additionalInfo: "",
    };
  }, [location]);

  const handleSubmit = useCallback(
    async (values: AddressForm) => {
      mutate(values);
      if (table) {
        await push(paths.locationsList(table.id), undefined, { preserveQuery: true });
      }
    },
    [mutate, push, table]
  );

  return { handleSubmit, initialValues, isLoading };
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

export default Finish;
