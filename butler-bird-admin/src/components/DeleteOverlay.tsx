import React, { FC, memo } from "react";
import style from "styles/components/DeleteOverlay.module.scss";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Button } from "components/Button";

type Props = {
  name: string;
  onDelete: () => void;
  onCancelDelete: () => void;
  deleting?: boolean;
};

export const DeleteOverlay: FC<Props> = memo(function DeleteOverlay({
  name,
  onDelete,
  onCancelDelete,
  deleting,
}) {
  const { t } = useDeleteOverlay();

  return (
    <div className={style.container}>
      <DeleteIcon className={style.icon} />
      <Typography className={style.info}>
        {t("components.deleteOverlay.deleting", { name: name })}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onDelete}
        rootClassName={style.btnDelete}
        loading={deleting}
      >
        {t("buttons.delete")}
      </Button>
      <Button
        disabled={deleting}
        startIcon={<CloseIcon />}
        onClick={onCancelDelete}
        rootClassName={style.btnCancel}
      >
        {t("buttons.dontDelete")}
      </Button>
    </div>
  );
});

function useDeleteOverlay() {
  const { t } = useTranslation();

  return { t };
}
