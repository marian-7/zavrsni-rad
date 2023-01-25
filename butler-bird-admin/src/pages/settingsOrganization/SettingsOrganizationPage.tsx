import React, { FC, memo } from "react";
import { SettingsOrganizationHeader } from "pages/settingsOrganization/components/SettingsOrganizationHeader";
import { Formik } from "formik";
import singlePageStyle from "styles/components/SinglePage.module.scss";
import { FormikInput } from "components/FormikInput";
import { useTranslation } from "react-i18next";
import style from "styles/pages/settingsOrganization/SettingsOrganizationPage.module.scss";
import { FormikImagePicker } from "components/FormikImagePicker";
import { useOrganization } from "hooks/useOrganization";
import { settingsOrganizationSchema } from "domain/util/validators";
import { getImageUrl } from "domain/models/Image";
import { useMutation, useQueryClient } from "react-query";
import { organizationService } from "domain/services/organizationService";
import { Organization } from "domain/models/Organization";
import { mapData } from "domain/util/axios";
import { useSnackbar } from "hooks/useSnackbar";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Form } from "components/Form";

interface Props {}

interface FormikValues extends Partial<Omit<Organization, "logo">> {
  logo?: { url: string } | File;
}

export const SettingsOrganizationPage: FC<Props> = memo(
  function SettingsOrganizationPage() {
    const { initialState, handleSubmit, t } = useSettingsOrganizationPage();

    return (
      <OverlayScrollbarsComponent
        className={singlePageStyle.container}
        options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
      >
        <Formik<FormikValues>
          initialValues={initialState}
          onSubmit={handleSubmit}
          enableReinitialize
          validationSchema={settingsOrganizationSchema}
        >
          {({ isSubmitting }) => (
            <Form className={singlePageStyle.form}>
              <SettingsOrganizationHeader isSubmitting={isSubmitting} />
              <div className={singlePageStyle.body}>
                <FormikInput
                  name="name"
                  label={t("form.labels.orgName")}
                  className={style.input}
                  showErrorOnTouched
                />
                <FormikImagePicker
                  fitMode="contain"
                  name="logo"
                  label={t("form.labels.orgLogo")}
                />
              </div>
            </Form>
          )}
        </Formik>
      </OverlayScrollbarsComponent>
    );
  }
);

function useSettingsOrganizationPage() {
  const qc = useQueryClient();
  const { t } = useTranslation();
  const { show } = useSnackbar();
  const organization = useOrganization();
  const { mutateAsync } = useMutation<Organization, unknown, FormikValues>(
    (data) => {
      const { logo, ...rest } = data;

      if (logo instanceof File) {
        return organizationService
          .update(
            { ...rest, id: organization!.id },
            logo instanceof File ? logo : undefined
          )
          .then(mapData);
      }

      return organizationService
        .update({
          ...rest,
          id: organization!.id,
          logo: logo ? undefined : null,
        })
        .then(mapData);
    },
    {
      onSuccess: (data) => {
        qc.setQueryData(["organizations", data.slug], data);
        show(t("snackbar.organizationUpdated"));
      },
    }
  );

  const initialState: FormikValues = {
    name: organization?.name,
    logo: organization?.logo
      ? { url: getImageUrl(organization.logo, "medium") }
      : undefined,
  };

  function handleSubmit(values: FormikValues) {
    return mutateAsync(values);
  }

  return { initialState, handleSubmit, t };
}
