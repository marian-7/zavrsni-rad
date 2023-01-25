import { FC, memo, useCallback } from "react";
import {
  ForgotPasswordForm,
  ForgotPasswordFormValues,
} from "./components/ForgotPasswordForm";
import { useMutation } from "react-query";
import { userService } from "../../domain/services/userService";
import { Formik } from "formik";
import { forgottenPasswordSchema } from "../../domain/util/validators";
import { Onboarding } from "../../components/Onboarding";

type Props = {};

export const ForgotPasswordPage: FC<Props> = memo(
  function ForgotPasswordPage() {
    const { initialValues, handleSubmit, isSuccess } = useForgotPasswordPage();

    return (
      <Onboarding
        form={
          <Formik<ForgotPasswordFormValues>
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={forgottenPasswordSchema}
          >
            {({ isSubmitting, values }) => {
              return (
                <ForgotPasswordForm
                  isSubmitting={isSubmitting}
                  isSuccess={isSuccess}
                  values={values}
                />
              );
            }}
          </Formik>
        }
      />
    );
  }
);

function useForgotPasswordPage() {
  const initialValues = {
    email: "",
  };

  const {
    mutate,
    isSuccess,
  } = useMutation(({ email }: ForgotPasswordFormValues) =>
    userService.forgottenPassword(email)
  );

  const handleSubmit = useCallback(
    (values: ForgotPasswordFormValues) => {
      return mutate(values);
    },
    [mutate]
  );

  return { initialValues, handleSubmit, isSuccess };
}

export default ForgotPasswordPage;
