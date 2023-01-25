import { FC, memo, useCallback } from "react";
import style from "styles/pages/staff-page.module.scss";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { StaffOptions } from "components/table/StaffOptions";
import { OrderType } from "domain/types/OrderType";
import { Dialog } from "components/Dialog";
import { useRouter } from "next/router";

type Props = {
  customOrderTypes: OrderType[];
  isOpen: boolean;
  onCallStaff: (tableId: string | number, type: number) => void;
  redirectToMenu?: () => void;
};

export const StaffModal: FC<Props> = memo(function StaffModal({
  customOrderTypes,
  isOpen,
  onCallStaff,
  redirectToMenu,
}) {
  const { handleClick, handleBack } = useStaffModal(onCallStaff);
  const { t } = useTranslation(["table", "common"]);

  const renderStaffOptions = useCallback(
    (customOrder: OrderType) => {
      return <StaffOptions key={customOrder.id} customOrder={customOrder} onClick={handleClick} />;
    },
    [handleClick]
  );

  return (
    <Dialog
      open={isOpen}
      onClose={redirectToMenu ?? handleBack}
      closeText={t("button.cancel", { ns: "common" })}
      containerClassName={style.root}
    >
      <Typography className="mb-3">{t("successInfo")}</Typography>
      {customOrderTypes.map(renderStaffOptions)}
    </Dialog>
  );
});

function useStaffModal(onCallStaff: (tableId: string | number, type: number) => void) {
  const { back } = useRouter();

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const handleClick = useCallback(
    (tableId: string | number, type: number) => {
      onCallStaff(tableId, type);
    },
    [onCallStaff]
  );

  return { handleClick, handleBack };
}
