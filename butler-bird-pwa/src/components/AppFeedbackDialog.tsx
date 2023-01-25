import React, { FC, memo, useCallback } from "react";
import { Dialog } from "components/Dialog";
import style from "styles/components/app-feedback.module.scss";
import { AppFeedback } from "./feedback/AppFeedback";
import { useRouter } from "next/router";
import { Session } from "next-auth";

type Props = {
  isOpen: boolean;
  session: Session;
};

export const AppFeedbackDialog: FC<Props> = memo(function AppFeedbackDialog({ isOpen, session }) {
  const { handleBack } = useAppFeedbackDialog();

  return (
    <Dialog open={isOpen} onBack={handleBack} topClassName={style.dialog} noPadding>
      <AppFeedback session={session} />
    </Dialog>
  );
});

function useAppFeedbackDialog() {
  const { back } = useRouter();

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  return { handleBack };
}
