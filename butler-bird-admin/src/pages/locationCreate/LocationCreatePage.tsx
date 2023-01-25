import { FC, memo, useCallback, useMemo } from "react";
import { Formik } from "formik";
import {
  LocationForm,
  LocationFormValues,
} from "components/locationForm/LocationForm";
import { useMutation, useQueryClient } from "react-query";
import { locationsService } from "domain/services/locationsService";
import { mapTranslation } from "domain/util/formik";
import { useOrganization } from "hooks/useOrganization";
import { AxiosResponse } from "axios";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { paths, withSlug } from "paths";
import { Location } from "domain/models/Location";

type Props = {};

export const LocationCreatePage: FC<Props> = memo(
  function LocationCreatePAge() {
    const {
      initialValues,
      handleSubmit,
      isSubmitting,
      organization,
    } = useLocationCreatePage();

    return (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <LocationForm isSubmitting={isSubmitting} organization={organization} />
      </Formik>
    );
  }
);

function useLocationCreatePage() {
  const qc = useQueryClient();
  const organization = useOrganization();
  const { show } = useSnackbar();
  const { t } = useTranslation();
  const { replace } = useHistory();

  const initialValues = useMemo(() => {
    const name = mapTranslation(organization?.languages);
    return {
      name: name,
      address: "",
      pins: [],
    };
  }, [organization?.languages]);

  const handleCreateSuccess = useCallback(
    ({ data }: AxiosResponse<Location>) => {
      show(t("snackbar.locationCreated"));
      qc.setQueryData<Location[]>("locations", (old) => {
        if (!old) {
          return [];
        }
        return [...old, data];
      });
      replace(withSlug(paths.location(data.id)));
    },
    [qc, replace, show, t]
  );

  const { mutateAsync: createLocation, isLoading: isSubmitting } = useMutation(
    (values: LocationFormValues) => {
      return locationsService.createLocation(values);
    },
    {
      onSuccess: handleCreateSuccess,
    }
  );

  const handleSubmit = useCallback(
    (values: LocationFormValues) => {
      return createLocation(values).catch(() => {});
    },
    [createLocation]
  );

  return { initialValues, handleSubmit, isSubmitting, organization };
}
