import { FC, memo, useCallback, useMemo } from "react";
import { Formik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { locationsService } from "domain/services/locationsService";
import { mapData } from "domain/util/axios";
import { mapTranslation } from "domain/util/formik";
import { useOrganization } from "hooks/useOrganization";
import {
  LocationForm,
  LocationFormValues,
} from "components/locationForm/LocationForm";
import { AxiosResponse } from "axios";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { paths, withSlug } from "paths";
import { Location } from "domain/models/Location";

type Props = {};

export const LocationPage: FC<Props> = memo(function LocationPage() {
  const {
    initialValues,
    handleSubmit,
    location,
    handleLocationDelete,
    isDeleting,
    isSubmitting,
    organization,
  } = useLocationPage();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <LocationForm
        location={location}
        isSubmitting={isSubmitting}
        onDelete={handleLocationDelete}
        isDeleting={isDeleting}
        organization={organization}
      />
    </Formik>
  );
});

function useLocationPage() {
  const qc = useQueryClient();
  const { replace } = useHistory();
  const { t } = useTranslation();
  const { show } = useSnackbar();
  const params = useParams<{ location: string }>();
  const locationId = toNumber(params.location);
  const organization = useOrganization();

  const { data: location } = useQuery(
    ["locations", locationId],
    ({ queryKey }) => {
      const [, locationId] = queryKey;
      return locationsService.getLocation(locationId).then(mapData);
    },
    {
      placeholderData: qc
        .getQueryData<Location[]>("locations")
        ?.find((l) => l.id === locationId),
    }
  );

  const initialValues = useMemo(() => {
    const name = mapTranslation(organization?.languages, location?.name);
    return {
      name: name,
      address: location?.address ?? "",
      pins: location?.pins ?? [],
    };
  }, [
    location?.address,
    location?.name,
    location?.pins,
    organization?.languages,
  ]);

  const handleUpdateSuccess = useCallback(
    ({ data }: AxiosResponse<Location>) => {
      show(t("snackbar.locationUpdated"));
      qc.setQueryData(["locations", data.id], data);
      qc.setQueryData<Location[]>("locations", (old) => {
        return (
          old?.map((location) => {
            return location.id === data.id
              ? { ...location, ...data }
              : location;
          }) ?? []
        );
      });
    },
    [qc, show, t]
  );

  const { mutateAsync: updateLocation, isLoading: isSubmitting } = useMutation(
    locationsService.updateLocation,
    {
      onSuccess: handleUpdateSuccess,
    }
  );

  const handleSubmit = useCallback(
    (values: LocationFormValues) => {
      return updateLocation({ ...values, id: locationId }).catch(() => {});
    },
    [locationId, updateLocation]
  );

  const handleDeleteSuccess = useCallback(
    ({ data: location }: AxiosResponse<Location>) => {
      show(t("snackbar.locationDeleted"));
      qc.setQueryData<Location[]>("locations", (old) => {
        return old?.filter((l) => l.id !== location.id) ?? [];
      });
      replace(withSlug(paths.locations()));
    },
    [qc, replace, show, t]
  );

  const { mutateAsync: deleteLocation, isLoading: isDeleting } = useMutation(
    locationsService.deleteLocation,
    {
      onSuccess: handleDeleteSuccess,
    }
  );

  const handleLocationDelete = useCallback(() => {
    return deleteLocation(locationId).catch(() => {});
  }, [deleteLocation, locationId]);

  return {
    initialValues,
    handleSubmit,
    location,
    handleLocationDelete,
    isDeleting,
    isSubmitting,
    organization,
  };
}
