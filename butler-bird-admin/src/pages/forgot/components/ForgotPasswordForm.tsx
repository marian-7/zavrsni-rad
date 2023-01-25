import { FC, memo } from "react";
import { Form } from "formik";
import { Typography } from "@material-ui/core";
import style from "../../../styles/pages/forgot/components/ForgotPasswordForm.module.scss";
import { FormikInput } from "../../../components/FormikInput";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "../../../components/Button";

export type ForgotPasswordFormValues = {
  email: string;
};

type Props = {
  isSubmitting: boolean;
  isSuccess: boolean;
  values: ForgotPasswordFormValues;
};

export const ForgotPasswordForm: FC<Props> = memo(function ForgotPasswordForm({
  isSubmitting,
  isSuccess,
  values,
}) {
  const { t } = useForgotPasswordForm();
  const { email } = values;

  return (
    <Form className={style.form}>
      <Typography variant="h2" classes={{ root: style.title }}>
        {t("pages.forgot.title")}
      </Typography>
      {isSuccess ? (
        <Typography variant="body1">
          <Trans
            i18nKey="pages.forgot.success"
            values={{ email: `${email}` }}
            components={{
              p: <p />,
            }}
          />
        </Typography>
      ) : (
        <>
          <Typography variant="body1" classes={{ root: style.subtitle }}>
            {t("pages.forgot.subtitle")}
          </Typography>
          <FormikInput
            name="email"
            placeholder={t("form.placeholders.email")}
            autoComplete="email"
            inputMode="email"
            className={style.input}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
            rootClassName={style.button}
          >
            {t("buttons.submit")}
          </Button>
        </>
      )}
    </Form>
  );
});

function useForgotPasswordForm() {
  const { t } = useTranslation();

  return { t };
}
