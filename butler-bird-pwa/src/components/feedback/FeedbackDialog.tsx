import { Dialog } from "components/Dialog";
import React, { FC, memo, useCallback } from "react";
import { Message } from "components/Message";
import { Button } from "components/Button";
import { useTranslation } from "next-i18next";
import { paths } from "paths";
import { useRouter } from "next/router";
import { useTable } from "hooks/useTable";
import { ReactComponent as SuccessIcon } from "assets/icons/success-icon.svg";
import style from "styles/components/feedback/feedback-dialog.module.scss";

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  isOnPage?: boolean;
};

export const FeedbackDialog: FC<Props> = memo(function FeedbackDialog(props) {
  const { isOpen } = props;
  const { handleRedirect } = useFeedbackDialog(props);
  const { t } = useTranslation("success");

  return (
    <Dialog open={isOpen} noPadding containerClassName={style.root}>
      <Message
        icon={<SuccessIcon />}
        message={t("feedbackSuccess")}
        mainButton={
          <Button variant="contained" color="primary" onClick={handleRedirect} fullWidth>
            {t("button.understand")}
          </Button>
        }
      />
    </Dialog>
  );
});

function useFeedbackDialog(props: Props) {
  const { onClose, isOnPage } = props;
  const { replace } = useRouter();
  const { table } = useTable();

  const handleRedirect = useCallback(() => {
    if (table) {
      if (onClose && !isOnPage) {
        onClose();
      }
      replace(paths.tables(table.id));
    }
  }, [isOnPage, onClose, replace, table]);

  return { handleRedirect };
}
