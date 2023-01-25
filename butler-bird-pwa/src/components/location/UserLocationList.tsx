import React, { FC, memo, useCallback, useMemo } from "react";
import { useUser } from "hooks/useUser";
import style from "styles/components/location/user-location-list.module.scss";
import { Formik } from "formik";
import { FormikLocationForm } from "components/location/FormikLocationForm";
import { selectedAddressSchema } from "domain/util/validation";
import { paths } from "paths";
import { useTable } from "hooks/useTable";
import { useRouter } from "hooks/useRouter";
import * as querystring from "querystring";
import { OrderModal } from "components/order/OrderPreview";
import { useLocation } from "hooks/useLocation";

type Props = {};

type FormValues = {
  selectedLocation?: number;
};

export enum LocationQuery {
  Navigation = "navigation",
}

export const UserLocationList: FC<Props> = memo(function UserLocationList() {
  const { userAddresses, initialValues, handleSubmit, handleBack } = useUserLocationList();

  return (
    <div className={style.root}>
      <div className={style.container}>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          enableReinitialize
          validationSchema={selectedAddressSchema}
          validateOnMount
        >
          <FormikLocationForm userAddresses={userAddresses} onBack={handleBack} />
        </Formik>
      </div>
    </div>
  );
});

function useUserLocationList() {
  const { userAddresses, userLocation, setUserDefaultLocation } = useUser();
  const { query, push } = useRouter();
  const { table } = useTable();
  const { clear } = useLocation();

  const initialValues = useMemo<FormValues>(() => {
    if (userAddresses?.length) {
      return { selectedLocation: userLocation?.id ?? userAddresses[0].id };
    }
    return {};
  }, [userAddresses, userLocation?.id]);

  const handleBack = useCallback(async () => {
    if (table) {
      if (query.from === LocationQuery.Navigation) {
        await push(paths.tables(table.id));
      } else {
        await push(paths.orderPreview(table.id));
      }
    }
  }, [push, query.from, table]);

  const handleRedirect = useCallback(async () => {
    if (table) {
      if (query.from === LocationQuery.Navigation) {
        await push(paths.tables(table.id));
      } else {
        await push(
          `${paths.orderPreview(table.id)}?${querystring.stringify({
            modal: OrderModal.ConfirmOrder,
          })}`
        );
      }
    }
  }, [push, query.from, table]);

  const handleSubmit = useCallback(
    async (value: FormValues) => {
      const selectedLocation = userAddresses?.find(
        (address) => address.id === value.selectedLocation
      );
      if (selectedLocation) {
        setUserDefaultLocation(selectedLocation);
        await handleRedirect();
        clear();
      }
    },
    [clear, handleRedirect, setUserDefaultLocation, userAddresses]
  );

  return { userAddresses, initialValues, handleSubmit, handleBack };
}
