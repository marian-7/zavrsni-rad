import { memo, useCallback, useMemo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { AddressDetails } from "components/location/AddressDetails";
import { getDefaultPageProps, redirectToLogin } from "domain/serverSideProps";
import { Session } from "next-auth";
import { Formik } from "formik";
import { useMutation, useQuery } from "react-query";
import { deleteUserAddress, getUserAddress, updateUserAddress } from "domain/services/userService";
import { useLocation } from "hooks/useLocation";
import { UserAddress } from "domain/types/Location";
import { useRouter } from "hooks/useRouter";
import { paths } from "paths";
import { useTable } from "hooks/useTable";

type Props = {
  session?: Session;
};

type AddressForm = {
  address?: UserAddress;
  additionalInfo?: string;
  deliveryInstructions?: string;
};

const DetailsPage: NextPage<Props> = memo(function DetailsPage({ session }) {
  const { initialValues, handleSubmit, handleDelete } = useDetailsPage(session);

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} enableReinitialize>
      <AddressDetails showDoneButton={false} session={session} onDelete={handleDelete} />
    </Formik>
  );
});

function useDetailsPage(session?: Session) {
  const { query, back, replace } = useRouter();
  const { setLocation } = useLocation();
  const { table } = useTable();

  const locationId = useMemo(() => {
    if (!Array.isArray(query.locationId)) {
      return query.locationId;
    }
  }, [query.locationId]);

  const { data: location } = useQuery(
    ["location", locationId],
    async ({ queryKey }) => {
      const [, id] = queryKey;
      try {
        if (id && session) {
          const res = await getUserAddress(session.accessToken, id);
          setLocation({ ...res.data });
          return res.data;
        }
      } catch (error) {
        throw error;
      }
    },
    { enabled: !!locationId }
  );

  const { mutate: updateMutation } = useMutation(async (values: AddressForm) => {
    try {
      const { additionalInfo, address, deliveryInstructions } = values;
      if (address && session && locationId) {
        const payload = {
          ...address,
          additionalInfo,
          deliveryInstructions,
        };
        await updateUserAddress(session.accessToken, locationId, payload);
      }
    } catch (error) {
      throw error;
    }
  });

  const { mutate: deleteMutation } = useMutation(async () => {
    try {
      if (locationId && session) {
        await deleteUserAddress(session.accessToken, locationId);
      }
    } catch (error) {
      throw error;
    }
  });

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

  const handleDelete = useCallback(async () => {
    if (table) {
      deleteMutation();
      await replace(paths.locationsList(table.id));
    }
  }, [deleteMutation, replace, table]);

  const handleSubmit = useCallback(
    (values: AddressForm) => {
      back();
      updateMutation(values);
    },
    [back, updateMutation]
  );

  return { initialValues, handleSubmit, handleDelete };
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

export default DetailsPage;
