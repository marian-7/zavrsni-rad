import React, { FC, memo, useContext } from "react";
import { SettingsStaffHeader } from "pages/settingsStaff/components/SettingsStaffHeader";
import singlePageStyle from "styles/components/SinglePage.module.scss";
import { Form, Formik } from "formik";
import { Typography } from "@material-ui/core";
import style from "styles/pages/settingsStaff/SettingsStaffPage.module.scss";
import { useTranslation } from "react-i18next";
import { CustomRoute } from "components/CustomRoute";
import { paths, withSlug } from "paths";
import { SettingsStaffInvitePage } from "pages/settingsStaffInvite/SettingsStaffInvitePage";
import { FormikStaffSelect } from "pages/settingsStaff/components/FormikStaffSelect";
import { useOrganization } from "hooks/useOrganization";
import { useMutation, useQueryClient } from "react-query";
import { Organization, Staff } from "domain/models/Organization";
import { organizationService } from "domain/services/organizationService";
import { mapData } from "domain/util/axios";
import { useSnackbar } from "hooks/useSnackbar";
import { UserContext } from "providers/UserProvider";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

interface Props {}

interface FormikValues {
  staff: Staff[];
}

export const SettingsStaffPage: FC<Props> = memo(function SettingsStaffPage() {
  const { initialValues, handleSubmit, t } = useSettingsStaffPage();

  return (
    <>
      <OverlayScrollbarsComponent
        className={singlePageStyle.container}
        options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
      >
        <Formik<FormikValues>
          onSubmit={handleSubmit}
          initialValues={initialValues}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className={singlePageStyle.form}>
              <SettingsStaffHeader isSubmitting={isSubmitting} />
              <div className={singlePageStyle.body}>
                <Typography className={style.label}>
                  {t("pages.settingsStaff.label")}
                </Typography>
                <Typography className={style.text}>
                  {t("pages.settingsStaff.note")}
                </Typography>
                <FormikStaffSelect name="staff" />
              </div>
            </Form>
          )}
        </Formik>
      </OverlayScrollbarsComponent>
      <CustomRoute path={withSlug(paths.settingsStaffInvite(), true)}>
        <SettingsStaffInvitePage />
      </CustomRoute>
    </>
  );
});

function useSettingsStaffPage() {
  const organization = useOrganization();
  const { user } = useContext(UserContext);
  const qc = useQueryClient();
  const { t } = useTranslation();
  const { show } = useSnackbar();

  const { mutateAsync } = useMutation<Organization, unknown, FormikValues>(
    (data) => {
      return organizationService
        .update({ ...data, id: organization!.id })
        .then(mapData);
    },
    {
      onSuccess: (data) => {
        show(t("snackbar.organizationUpdated"));
        qc.setQueryData(["organizations", data.slug], data);
      },
    }
  );

  const initialValues = {
    staff:
      organization?.staff.filter((staff) => staff.email !== user?.email) ?? [],
  };

  function handleSubmit(values: FormikValues) {
    return mutateAsync(values).catch(() => {});
  }

  return { initialValues, mutateAsync, handleSubmit, t };
}
