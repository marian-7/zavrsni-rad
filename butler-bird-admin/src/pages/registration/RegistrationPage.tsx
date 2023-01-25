import React, { FC, memo } from "react";
import { useOrganizationQuery } from "hooks/useOrganizationQuery";
import { RegistrationForm } from "pages/registration/components/RegistrationForm";
import { Formik } from "formik";
import { registrationSchema } from "domain/util/validators";
import { useUrlQuery } from "hooks/useUrlQuery";
import { useHistory, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { AcceptData, staffService } from "domain/services/staffService";
import { omit } from "lodash";
import { paths, withSlug } from "paths";

interface Props {}

interface FormikValues {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}

const RegistrationPage: FC<Props> = memo(function RegistrationPage() {
  const { organization, initialValues, handleSubmit } = useRegistrationPage();

  if (!organization) {
    return null;
  }

  return (
    <Formik<FormikValues>
      validationSchema={registrationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <RegistrationForm organization={organization} />
    </Formik>
  );
});

function useRegistrationPage() {
  const { replace } = useHistory();
  const { invitation } = useParams<{ invitation: string }>();
  const { data: organization } = useOrganizationQuery();
  const { email } = useUrlQuery();
  const { mutateAsync } = useMutation<unknown, unknown, AcceptData>(
    (data) => {
      return staffService.accept(data);
    },
    {
      onSuccess: () => {
        replace(withSlug(paths.login()));
      },
    }
  );

  const initialValues = {
    uid: invitation,
    email: typeof email === "string" ? email : "",
    firstName: "",
    lastName: "",
    password: "",
    passwordConfirm: "",
  };

  function handleSubmit(values: FormikValues) {
    return mutateAsync(omit(values, ["passwordConfirm"])).catch(() => {});
  }

  return { organization, initialValues, handleSubmit };
}

export default RegistrationPage;
