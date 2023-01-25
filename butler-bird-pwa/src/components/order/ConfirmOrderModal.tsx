import React, { FC, memo } from "react";
import { Message } from "components/Message";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { Dialog } from "components/Dialog";
import { useTranslation } from "next-i18next";
import { Button } from "components/Button";
import { useRouter } from "next/router";

type Props = {
  isOpen: boolean;
  onSubmit: () => void;
};

export const ConfirmOrderModal: FC<Props> = memo(function ConfirmOrderModal({ isOpen, onSubmit }) {
  useConfirmOrderModal();
  const { back } = useRouter();

  const { t } = useTranslation("orderPreview");

  return (
    <Dialog open={isOpen} noPadding containerClassName="dialog-responsive">
      <Message
        icon={<ErrorOutlineIcon />}
        message={t("dialog.createOrder")}
        mainButton={
          <Button color="primary" variant="contained" onClick={onSubmit} className="mb-3" fullWidth>
            {t("dialog.button.createOrder")}
          </Button>
        }
        secondButton={
          <Button color="secondary" variant="contained" fullWidth onClick={back}>
            {t("button.cancel")}
          </Button>
        }
      />
    </Dialog>
  );
});

function useConfirmOrderModal() {}
