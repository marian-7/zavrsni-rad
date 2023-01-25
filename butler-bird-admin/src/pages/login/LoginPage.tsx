import { FC, memo, useCallback, useContext, useEffect } from "react";
import { LoginForm, LoginFormValues } from "./components/LoginForm";
import { loginSchema } from "domain/util/validators";
import { Formik } from "formik";
import { UserContext } from "providers/UserProvider";
import { I18nextContext } from "providers/I18nextProvider";
import { Onboarding } from "components/Onboarding";
import { useOrganizationQuery } from "hooks/useOrganizationQuery";

type Props = {};

export const LoginPage: FC<Props> = memo(function LoginPage() {
  const { initialValues, handleSubmit } = useLoginPage();

  return (
    <Onboarding
      form={
        <Formik<LoginFormValues>
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={loginSchema}
        >
          {({ isSubmitting }) => {
            return <LoginForm isSubmitting={isSubmitting} />;
          }}
        </Formik>
      }
    />
  );
});

function useLoginPage() {
  const { login } = useContext(UserContext);
  const { setLng } = useContext(I18nextContext);
  const { data } = useOrganizationQuery();

  const initialValues = {
    identifier: "",
    password: "",
  };

  useEffect(() => {
    const [lang] = data?.languages ?? [];
    if (lang) {
      setLng(lang);
    }
  }, [data?.languages, setLng]);

  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        await login(values);
      } catch (e) {}
    },
    [login]
  );

  return {
    initialValues,
    handleSubmit,
  };
}

export default LoginPage;
