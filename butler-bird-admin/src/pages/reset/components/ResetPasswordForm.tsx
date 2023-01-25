import { FC, memo } from "react";
import { Form } from "formik";
import { Button, Typography } from "@material-ui/core";
import style from "../../../styles/pages/reset/components/ResetPasswordForm.module.scss";
import { FormikInput } from "../../../components/FormikInput";
import { useTranslation } from "react-i18next";

export type ResetPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
};

type Props = {
  isSubmitting: boolean;
};

export const ResetPasswordForm: FC<Props> = memo(function ResetPasswordForm({
  isSubmitting,
}) {
  const { t } = useResetPasswordForm();

  return (
    <Form className={style.form}>
      <Typography variant="h2" className={style.title}>
        {t("pages.reset.title")}
      </Typography>
      <Typography variant="body1" className={style.subtitle}>
        {t("pages.reset.subtitle")}
      </Typography>
      <FormikInput
        name="password"
        placeholder="Password"
        autoComplete="password"
        type="password"
      />
      <FormikInput
        name="passwordConfirmation"
        placeholder="Confirm password"
        autoComplete="password"
        type="password"
        className={style.input}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={isSubmitting}
        className={style.button}
      >
        {t("buttons.submit")}
      </Button>
    </Form>
  );
});

function useResetPasswordForm() {
  const { t } = useTranslation();

  return { t };
}
