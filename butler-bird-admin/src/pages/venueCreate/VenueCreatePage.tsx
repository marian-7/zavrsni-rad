import React, { FC, memo } from "react";
import { VenueForm } from "components/venueForm/VenueForm";
import { Formik } from "formik";
import { useMutation, useQueryClient } from "react-query";
import { CreateVenueData, venuesService } from "domain/services/venuesService";
import { Venue } from "domain/models/Venue";
import { useHistory } from "react-router-dom";
import { paths, withSlug } from "paths";
import { Location } from "domain/models/Location";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { mapTranslation, validate } from "domain/util/formik";
import { venueSchema } from "domain/util/validators";
import { useOrganization } from "hooks/useOrganization";
import { updateLocations } from "queries/utils/venue";
import { nextTick } from "util/nextTick";

interface Props {}

export const VenueCreatePage: FC<Props> = memo(function VenueCreatePage() {
  const { handleSubmit, initialValues, organization } = useVenueCreatePage();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate(venueSchema, { context: organization })}
    >
      <VenueForm organization={organization} />
    </Formik>
  );
});

function useVenueCreatePage() {
  const { replace } = useHistory();
  const { show } = useSnackbar();
  const qc = useQueryClient();
  const { t } = useTranslation();
  const organization = useOrganization();

  const { mutateAsync } = useMutation(
    (data: CreateVenueData) => {
      return venuesService.create(data);
    },
    {
      onSuccess: ({ data }) => {
        show(t("snackbar.venueCreated"));
        qc.setQueryData<Location[]>("locations", (old) =>
          updateLocations(old, data)
        );
        qc.setQueryData<Venue>(["venues", data.id], data);
        qc.setQueryData<Venue[]>("venues", (old) => {
          if (!old) {
            return [data];
          }
          return old.concat([data]);
        });
        nextTick(() => replace(withSlug(paths.venue(data.id))));
      },
    }
  );

  const initialValues = {
    name: {},
    takeout: false,
    bannerMessage: mapTranslation(organization?.languages),
  };

  function handleSubmit(values: CreateVenueData) {
    return mutateAsync(values);
  }

  return { handleSubmit, initialValues, organization };
}
