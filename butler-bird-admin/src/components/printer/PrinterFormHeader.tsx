import React, { FC, memo } from "react";
import style from "styles/components/SinglePageHeader.module.scss";
import { useTranslation } from "react-i18next";
import { Button } from "components/Button";
import { ReactComponent as DeleteIcon } from "assets/icons/highlight-off.svg";
import { useFormikContext } from "formik";
import { PrinterFormValues } from "components/printer/PrinterForm";
import { Typography } from "@material-ui/core";

interface Props {
  create: boolean;
  onDeleteClick?: () => void;
}

export const PrinterFormHeader: FC<Props> = memo(function PrinterFormHeader(
  props
) {
  const { create, onDeleteClick } = props;
  const { isSubmitting, initialValues } = usePrinterFormHeader();
  const { t } = useTranslation();

  return (
    <div className={style.header}>
      <div className="flex-1 flex-direction-column align-self-stretch">
        <Typography className={style.label}>
          {initialValues.name || initialValues.serialNumber}
        </Typography>
        <Typography>
          {initialValues.name ? initialValues.serialNumber : ""}
        </Typography>
      </div>
      {!create && (
        <Button
          startIcon={<DeleteIcon />}
          color="primary"
          variant="text"
          className={style.delete}
          disabled={isSubmitting}
          onClick={onDeleteClick}
        >
          {t("buttons.delete")}
        </Button>
      )}
      <Button
        color="primary"
        variant="contained"
        className={style.save}
        type="submit"
        loading={isSubmitting}
      >
        {t("buttons.saveChanges")}
      </Button>
    </div>
  );
});

function usePrinterFormHeader() {
  const { isSubmitting, initialValues } = useFormikContext<PrinterFormValues>();

  return { isSubmitting, initialValues };
}
