import { FC, memo } from "react";
import { Form } from "formik";
import { Typography } from "@material-ui/core";
import style from "../../../styles/pages/login/components/LoginForm.module.scss";
import { Button } from "../../../components/Button";
import { FormikInput } from "../../../components/FormikInput";
import { useTranslation } from "react-i18next";
import { paths } from "../../../paths";
import { useParams, Link } from "react-router-dom";

export type LoginFormValues = {
  identifier: string;
  password: string;
};

type Props = {
  isSubmitting: boolean;
};

export const LoginForm: FC<Props> = memo(function LoginForm({ isSubmitting }) {
  const { t, slug } = useLoginForm();

  return (
    <Form className={style.form}>
      <Typography variant="h2" classes={{ root: style.title }}>
        {t("pages.login.title")}
      </Typography>
      <Typography variant="body1" classes={{ root: style.subtitle }}>
        {t("pages.login.subtitle")}
      </Typography>
      <FormikInput
        name="identifier"
        placeholder={t("form.placeholders.email")}
        autoComplete="email"
        inputMode="email"
      />
      <FormikInput
        name="password"
        placeholder={t("form.placeholders.password")}
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
        rootClassName={style.button}
      >
        {isSubmitting ? t("buttons.loginSubmitting") : t("buttons.login")}
      </Button>
      <Link to={paths.forgotPassword(slug)} className={style.link}>
        <Typography variant="body1" className={style.forgot}>
          {t("pages.login.forgotPassword")}
        </Typography>
      </Link>
    </Form>
  );
});

function useLoginForm() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  return { t, slug };
}
