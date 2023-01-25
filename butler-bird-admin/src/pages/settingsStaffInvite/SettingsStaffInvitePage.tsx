import React, { FC, memo } from "react";
import { SidePage } from "components/SidePage";
import { useTranslation } from "react-i18next";
import { paths, withSlug } from "paths";
import { StaffInviteForm } from "pages/settingsStaffInvite/components/StaffInviteForm";
import { Formik } from "formik";
import { staffInviteSchema } from "domain/util/validators";
import { useMutation, useQueryClient } from "react-query";
import { organizationService } from "domain/services/organizationService";
import { Organization, Staff } from "domain/models/Organization";
import { mapData } from "domain/util/axios";
import { StaffInviteSuccess } from "pages/settingsStaffInvite/components/StaffInviteSuccess";
import { useOrganization } from "hooks/useOrganization";
import { uniqBy } from "lodash";

interface Props {}

interface FormikValues {
  email: string;
}

export const SettingsStaffInvitePage: FC<Props> = memo(
  function SettingsStaffInvitePage() {
    const {
      initialValues,
      handleSubmit,
      isSuccess,
      variables,
      reset,
    } = useSettingsStaffInvitePage();
    const { t } = useTranslation();

    return (
      <SidePage
        title={t("pages.settingsStaffInvite.title")}
        to={withSlug(paths.settingsStaff())}
        replaceList
      >
        {isSuccess ? (
          <StaffInviteSuccess email={variables!} onInviteMoreClick={reset} />
        ) : (
          <Formik<FormikValues>
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={staffInviteSchema}
          >
            <StaffInviteForm />
          </Formik>
        )}
      </SidePage>
    );
  }
);

function useSettingsStaffInvitePage() {
  const organization = useOrganization();
  const qc = useQueryClient();
  const { mutateAsync, variables, isSuccess, reset } = useMutation<
    Staff,
    unknown,
    string
  >(
    (email) => {
      return organizationService.invite(email).then(mapData);
    },
    {
      onSuccess: (data) => {
        if (data.id) {
          qc.setQueryData<Organization | undefined>(
            ["organizations", organization?.slug],
            (old) => {
              if (!old) {
                return old;
              }
              return {
                ...old,
                staff: uniqBy([data].concat(old.staff), "id"),
              };
            }
          );
        }
      },
    }
  );

  const initialValues = {
    email: "",
  };

  function handleSubmit(values: FormikValues) {
    return mutateAsync(values.email);
  }

  return { initialValues, handleSubmit, isSuccess, variables, reset };
}
