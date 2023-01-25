import React, { FC, memo } from "react";
import { Organization } from "domain/models/Organization";
import { Form, useFormikContext } from "formik";
import style from "styles/pages/registration/components/RegistrationForm.module.scss";
import { getImageUrl } from "domain/models/Image";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { FormikInput } from "components/FormikInput";
import { Button } from "components/Button";

interface Props {
  organization: Organization;
}

export const RegistrationForm: FC<Props> = memo(function RegistrationForm(
  props
) {
  const { isSubmitting } = useRegistrationForm();
  const { organization } = props;
  const { t } = useTranslation();

  return (
    <Form className={style.form}>
      <div className={style.content}>
        <img
          className={style.logo}
          src={getImageUrl(organization.logo, "small")}
          alt=""
        />
        <Typography className={style.description}>
          {t("pages.registration.description")}
        </Typography>
        <div className={style.group}>
          <FormikInput
            name="firstName"
            label={t("form.labels.firstName")}
            showErrorOnTouched
            errorIcon={false}
          />
          <FormikInput
            name="lastName"
            label={t("form.labels.lastName")}
            showErrorOnTouched
            errorIcon={false}
          />
        </div>
        <FormikInput
          name="email"
          label={t("form.labels.email")}
          showErrorOnTouched
          autoComplete="username"
          readOnly
          errorIcon={false}
        />
        <FormikInput
          name="password"
          label={t("form.labels.password")}
          showErrorOnTouched
          type="password"
          autoComplete="new-password"
          errorIcon={false}
        />
        <FormikInput
          name="passwordConfirm"
          label={t("form.labels.confirmPassword")}
          showErrorOnTouched
          type="password"
          autoComplete="new-password"
          errorIcon={false}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={style.submit}
          loading={isSubmitting}
        >
          {t("buttons.submit")}
        </Button>
      </div>
    </Form>
  );
});

function useRegistrationForm() {
  const { isSubmitting } = useFormikContext();

  return { isSubmitting };
}
