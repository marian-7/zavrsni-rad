import React, { FC, memo, useCallback, useState } from "react";
import { Formik } from "formik";
import { appFeedbackSchema } from "domain/util/validation";
import { AppFeedbackForm } from "components/feedback/AppFeedbackForm";
import { FeedbackDialog } from "components/feedback/FeedbackDialog";
import { useMutation } from "react-query";
import { appFeedback } from "domain/services/feedbackService";
import { getToken } from "domain/services/userIdentification";
import { Session } from "next-auth";

type Props = {
  isOnPage?: boolean;
  session: Session;
};

export type AppFeedbackFormValues = {
  firstUsage: boolean;
  rating: number;
  preferredInteraction: boolean;
  note: string;
};

const initialValues: AppFeedbackFormValues = {
  firstUsage: true,
  rating: 0,
  preferredInteraction: true,
  note: "",
};

export const AppFeedback: FC<Props> = memo(function AppFeedback({ isOnPage = false, session }) {
  const { handleSubmit, showDialog, handleDialog } = useAppFeedback(session);

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={appFeedbackSchema}
        validateOnMount={true}
      >
        <AppFeedbackForm />
      </Formik>
      <FeedbackDialog isOpen={showDialog} onClose={handleDialog} isOnPage={isOnPage} />
    </>
  );
});

function useAppFeedback(session: Session) {
  const [showDialog, setShowDialog] = useState(false);

  const { mutate, isLoading } = useMutation(async (values: AppFeedbackFormValues) => {
    try {
      const installation = await getToken();
      const res = await appFeedback(installation, values, session?.accessToken);
      setShowDialog(true);
      return res.data;
    } catch (error) {
      throw error;
    }
  });

  const handleDialog = useCallback(() => {
    setShowDialog((prevState) => !prevState);
  }, []);

  const handleSubmit = useCallback(
    (values) => {
      mutate(values);
    },
    [mutate]
  );
  return { handleSubmit, isLoading, showDialog, handleDialog };
}
