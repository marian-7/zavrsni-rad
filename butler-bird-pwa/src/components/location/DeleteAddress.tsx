import React, { FC, memo } from "react";
import { ReactComponent as CancelIcon } from "assets/icons/cancel-icon.svg";
import { Button } from "components/Button";
import { Message } from "components/Message";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Dialog } from "components/Dialog";

type Props = {
  isOpen: boolean;
  onDelete?: () => void;
};

export const DeleteAddress: FC<Props> = memo(function DeleteAddress({ isOpen, onDelete }) {
  useDeleteAddress();
  const { back } = useRouter();
  const { t } = useTranslation(["location", "common"]);

  return (
    <Dialog open={isOpen} noPadding containerClassName="dialog-responsive">
      <Message
        icon={<CancelIcon />}
        message={t("deleteAddressInfo")}
        mainButton={
          <Button variant="contained" color="primary" onClick={onDelete} fullWidth className="mb-3">
            {t("button.removeAddress")}
          </Button>
        }
        secondButton={
          <Button variant="contained" color="secondary" onClick={back} fullWidth>
            {t("button.cancel", { ns: "common" })}
          </Button>
        }
      />
    </Dialog>
  );
});

function useDeleteAddress() {}
