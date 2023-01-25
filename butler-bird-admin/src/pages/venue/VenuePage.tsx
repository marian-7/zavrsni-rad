import React, { FC, memo, useMemo } from "react";
import { VenueForm } from "components/venueForm/VenueForm";
import { Formik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UpdateVenueData, venuesService } from "domain/services/venuesService";
import { mapData } from "domain/util/axios";
import { Venue } from "domain/models/Venue";
import { Location } from "domain/models/Location";
import { paths, withSlug } from "paths";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";
import { mapTranslation, validate } from "domain/util/formik";
import { venueSchema } from "domain/util/validators";
import { useOrganization } from "hooks/useOrganization";
import { updateLocations } from "queries/utils/venue";

interface Props {}

export const VenuePage: FC<Props> = memo(function VenuePage() {
  const {
    initialValues,
    handleSubmit,
    id,
    handleDelete,
    deleting,
    organization,
  } = useVenuePage();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validate={validate(venueSchema, { context: organization })}
    >
      <VenueForm
        venue={id}
        organization={organization}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </Formik>
  );
});

function useVenuePage() {
  const { show } = useSnackbar();
  const { replace } = useHistory();
  const params = useParams<{ venue: string }>();
  const id = toNumber(params.venue);
  const qc = useQueryClient();
  const { t } = useTranslation();
  const organization = useOrganization();

  const { mutateAsync: update } = useMutation(
    (data: UpdateVenueData) => {
      return venuesService.update(data);
    },
    {
      onSuccess: ({ data }) => {
        show(t("snackbar.venueUpdated"));
        qc.setQueryData<Location[]>("locations", (old) =>
          updateLocations(old, data)
        );
        qc.setQueryData<Venue>(["venues", id], data);
        qc.setQueryData<Venue[]>("venues", (old) => {
          if (!old) {
            return [data];
          }
          return old.map((venue) => (venue.id === data.id ? data : venue));
        });
      },
    }
  );

  const { mutateAsync: remove, isLoading: deleting } = useMutation(
    (data: number) => venuesService.remove(data),
    {
      onSuccess: (_, id) => {
        show(t("snackbar.venueDeleted"));
        replace(withSlug(paths.venues()));
        qc.setQueryData<Venue | undefined>(["venues", id], undefined);
        qc.setQueryData<Venue[]>("venues", (old) => {
          if (!old) {
            return [];
          }
          return old.filter((venue) => venue.id !== id);
        });
        qc.setQueryData<Location[]>("locations", (old) => {
          if (!old) {
            return [];
          }
          return old.map((location) => {
            if (location.venues.includes(id)) {
              return {
                ...location,
                venues: location.venues.filter((venue) => venue !== id),
              };
            }
            return location;
          });
        });
      },
    }
  );

  const { data: venue } = useQuery(
    ["venues", id],
    ({ queryKey }) => {
      const [, id] = queryKey;
      return venuesService.get(id).then(mapData);
    },
    {
      placeholderData: () =>
        qc.getQueryData<Venue[]>("venues")?.find((venue) => venue.id === id),
    }
  );

  const initialValues = useMemo(() => {
    const bannerMessage = mapTranslation(
      organization?.languages,
      venue?.bannerMessage
    );
    const takeout = venue?.takeout ?? false;

    return venue
      ? { ...venue, bannerMessage, takeout }
      : { id, bannerMessage, takeout };
  }, [id, organization?.languages, venue]);

  function handleSubmit(values: UpdateVenueData) {
    return update({ ...values, id }).catch(() => {});
  }

  function handleDelete() {
    return remove(id);
  }

  return {
    initialValues,
    handleSubmit,
    id,
    handleDelete,
    deleting,
    organization,
  };
}
