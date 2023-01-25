import React, { FC, memo, useCallback } from "react";
import { Dialog } from "./Dialog";
import { Button } from "components/Button";
import { Message as SuccessComponent } from "components/Message";
import { useTranslation } from "next-i18next";
import { useOrder } from "hooks/useOrder";
import style from "styles/components/call-staff-result.module.scss";
import { ReactComponent as SuccessIcon } from "assets/icons/success-icon.svg";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CallStaffResultModal: FC<Props> = memo(function CallStaffModal({ isOpen, onClose }) {
  const { handleClick } = useCallStaffModal(onClose);
  const { t } = useTranslation(["success", "common"]);

  return (
    <Dialog open={isOpen} noPadding containerClassName="dialog-responsive">
      <SuccessComponent
        icon={<SuccessIcon />}
        message={t("message", { ns: "success" })}
        textClassName={style.text}
        mainButton={
          <Button variant="contained" color="primary" onClick={handleClick} fullWidth>
            {t("button.understand", { ns: "common" })}
          </Button>
        }
      />
    </Dialog>
  );
});

function useCallStaffModal(onClose: () => void) {
  const { clearOrder } = useOrder();

  const handleClick = useCallback(() => {
    clearOrder();
    onClose();
  }, [clearOrder, onClose]);

  return { handleClick };
}
