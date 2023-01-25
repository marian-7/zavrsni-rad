import { FC, memo, useCallback } from "react";
import {
  ResetPasswordForm,
  ResetPasswordFormValues,
} from "./components/ResetPasswordForm";
import { useQueryString } from "../../hooks/useQueryString";
import { useMutation } from "react-query";
import { userService } from "../../domain/services/userService";
import { Formik } from "formik";
import { resetPasswordSchema } from "../../domain/util/validators";
import { Onboarding } from "../../components/Onboarding";
import { useHistory } from "react-router-dom";
import { paths, withSlug } from "../../paths";

type Props = {};

export const ResetPasswordPage: FC<Props> = memo(function ResetPasswordPage() {
  const { initialValues, handleSubmit } = useResetPasswordPage();

  return (
    <Onboarding
      form={
        <Formik<ResetPasswordFormValues>
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={resetPasswordSchema}
        >
          {({ isSubmitting }) => {
            return <ResetPasswordForm isSubmitting={isSubmitting} />;
          }}
        </Formik>
      }
    />
  );
});

function useResetPasswordPage() {
  const history = useHistory();
  const initialValues = {
    password: "",
    passwordConfirmation: "",
  };

  const query = useQueryString();
  const code = typeof query.code === "string" ? query.code : undefined;

  const onSuccess = useCallback(() => {
    history.replace(withSlug(paths.login()));
  }, [history]);

  const { mutate } = useMutation<
    unknown,
    unknown,
    ResetPasswordFormValues & { code: string }
  >((values) => userService.resetPassword(values), {
    onSuccess: onSuccess,
  });

  const handleSubmit = useCallback(
    (values: ResetPasswordFormValues) => {
      if (code) {
        return mutate({ ...values, code });
      }
    },
    [code, mutate]
  );

  return { initialValues, handleSubmit };
}

export default ResetPasswordPage;
