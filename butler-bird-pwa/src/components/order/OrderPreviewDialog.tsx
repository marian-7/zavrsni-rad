import React, { FC, memo, useCallback } from "react";
import { Dialog } from "components/Dialog";
import { Button } from "components/Button";
import { Message } from "components/Message";
import { useTranslation } from "next-i18next";
import style from "styles/components/order/order-preview-dialog.module.scss";
import { useOrder } from "hooks/useOrder";
import { useRouter } from "next/router";
import { paths } from "paths";
import { useTable } from "hooks/useTable";
import { OrderPreviewModalState } from "components/order/OrderPreview";
import { ReactComponent as SuccessIcon } from "assets/icons/success-icon.svg";
import { ReactComponent as CancelIcon } from "assets/icons/cancel-icon.svg";

type Props = {
  isOpen: boolean;
  dialogType: OrderPreviewModalState;
  closeDialog: () => void;
  retryOrder: () => void;
  callStaff: () => void;
};

export const OrderPreviewDialog: FC<Props> = memo(function OrderPreviewDialog({
  isOpen,
  dialogType,
  retryOrder,
  callStaff,
}) {
  const { cancelOrder, goToAppSurvey, goToTablePage, back } = useOrderPreviewDialog();
  const { t } = useTranslation("success");

  return (
    <Dialog open={isOpen} noPadding containerClassName={style.root}>
      {dialogType === OrderPreviewModalState.Success && (
        <Message
          icon={<SuccessIcon />}
          message={t("orderSuccess")}
          mainButton={
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={goToAppSurvey}
              className="mb-3"
            >
              {t("button.goToSurvey")}
            </Button>
          }
          secondButton={
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              className={style.cancelBtn}
              onClick={goToTablePage}
            >
              {t("button.skip")}
            </Button>
          }
        />
      )}
      {dialogType === OrderPreviewModalState.Cancel && (
        <Message
          icon={<CancelIcon />}
          message={t("cancelOrder")}
          textClassName={style.text}
          mainButton={
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={cancelOrder}
              className="mb-3"
            >
              {t("button.cancel")}
            </Button>
          }
          secondButton={
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              className={style.cancelBtn}
              onClick={back}
            >
              {t("button.continue")}
            </Button>
          }
        />
      )}
      {dialogType === OrderPreviewModalState.Error && (
        <Message
          icon={<CancelIcon />}
          message={t("orderError")}
          textClassName={style.text}
          mainButton={
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={retryOrder}
              className="mb-3"
            >
              {t("button.tryAgain")}
            </Button>
          }
          secondButton={
            <Button
              color="secondary"
              variant="contained"
              className={style.cancelBtn}
              fullWidth
              onClick={callStaff}
            >
              {t("button.callStaff")}
            </Button>
          }
        />
      )}
    </Dialog>
  );
});

function useOrderPreviewDialog() {
  const { replace, back } = useRouter();
  const { clearOrder } = useOrder();

  const { table } = useTable();

  const goToTablePage = useCallback(async () => {
    if (table) {
      await replace(paths.tables(table.id));
    }
    clearOrder();
  }, [clearOrder, replace, table]);

  const cancelOrder = useCallback(() => {
    clearOrder();
    back();
  }, [back, clearOrder]);

  const goToAppSurvey = useCallback(async () => {
    if (table) {
      await replace(paths.appFeedback(table.id));
    }
    clearOrder();
  }, [clearOrder, replace, table]);

  return { cancelOrder, goToAppSurvey, goToTablePage, back };
}
