import { Dialog } from "components/Dialog";
import React, { FC, memo } from "react";
import { Message } from "components/Message";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useTranslation } from "next-i18next";
import { Button } from "components/Button";
import { useRouter } from "next/router";

type Props = {
  isOpen: boolean;
  onClick: () => void;
};

export const DeleteItemModal: FC<Props> = memo(function DeleteItemModal({ isOpen, onClick }) {
  useDeleteItemModal();
  const { back } = useRouter();

  const { t } = useTranslation("orderPreview");

  return (
    <Dialog open={isOpen} noPadding containerClassName="dialog-responsive">
      <Message
        icon={<ErrorOutlineIcon />}
        message={t("dialog.deleteItem")}
        mainButton={
          <Button color="primary" variant="contained" fullWidth className="mb-3" onClick={onClick}>
            {t("dialog.button.deleteItem")}
          </Button>
        }
        secondButton={
          <Button color="primary" onClick={back} fullWidth>
            {t("button.cancel")}
          </Button>
        }
      />
    </Dialog>
  );
});

function useDeleteItemModal() {}
