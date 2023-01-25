import { memo, useCallback, useState } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { Formik } from "formik";
import { OrganizationFeedbackForm } from "components/feedback/OrganizationFeedbackForm";
import style from "styles/pages/organization-feedback-page.module.scss";
import { getDefaultPageProps } from "domain/serverSideProps";
import { FeedbackDialog } from "components/feedback/FeedbackDialog";
import { useMutation } from "react-query";
import { organizationFeedback } from "domain/services/feedbackService";
import { organizationFeedbackSchema } from "domain/util/validation";
import { useTable } from "hooks/useTable";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { useTranslation } from "next-i18next";
import CloseIcon from "@material-ui/icons/Close";
import { useRouter } from "next/router";
import { paths } from "paths";
import { getToken } from "domain/services/userIdentification";
import { Session } from "next-auth";

type Props = {
  session: Session;
};

export type OrganizationFeedbackFormValues = {
  foodRating: number;
  speedRating: number;
  note: string;
};

const initialValues: OrganizationFeedbackFormValues = {
  foodRating: 0,
  speedRating: 0,
  note: "",
};

const OrganizationFeedbackPage: NextPage<Props> = memo(function OrganizationFeedbackPage({
  session,
}) {
  const { handleSubmit, showDialog, goToTablePage } = useOrganizationFeedbackPage(session);
  const { t } = useTranslation("common");

  return (
    <div className={style.root}>
      <div className={style.container}>
        <ButtonWithIcon className={style.btn} startIcon={<CloseIcon />} onClick={goToTablePage}>
          {t("button.close")}
        </ButtonWithIcon>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={organizationFeedbackSchema}
          validateOnMount
        >
          <OrganizationFeedbackForm />
        </Formik>
        <FeedbackDialog isOpen={showDialog} />
      </div>
    </div>
  );
});

function useOrganizationFeedbackPage(session?: Session) {
  const [showDialog, setShowDialog] = useState(false);
  const { replace } = useRouter();

  const handleDialog = useCallback(() => {
    setShowDialog((prevState) => !prevState);
  }, []);

  const { mutate } = useMutation(
    async (values: { formValues: OrganizationFeedbackFormValues; organization: number }) => {
      const { formValues, organization } = values;
      try {
        const installation = await getToken();
        const res = await organizationFeedback(
          installation,
          formValues,
          organization,
          session?.accessToken
        );
        handleDialog();
        return res.data;
      } catch (error) {
        throw error;
      }
    }
  );

  const { table } = useTable();

  const handleSubmit = useCallback(
    (formValues: OrganizationFeedbackFormValues) => {
      if (table) {
        mutate({ formValues, organization: table.organization });
      }
    },
    [mutate, table]
  );

  const goToTablePage = useCallback(() => {
    if (table) {
      replace(paths.tables(table.id));
    }
  }, [replace, table]);

  return { showDialog, handleSubmit, handleDialog, goToTablePage };
}

export default OrganizationFeedbackPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["common", "success"]);
  return {
    props: {
      ...props,
    },
  };
}
