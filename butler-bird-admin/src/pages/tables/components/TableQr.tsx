import React, { FC, memo } from "react";
import style from "styles/pages/tables/components/TableQr.module.scss";
import { Table } from "domain/models/Venue";
import QRCode from "qrcode.react";
import { IconButton, Typography, useTheme } from "@material-ui/core";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";
import { ReactComponent as PrinterIcon } from "assets/icons/printer.svg";
import { ReactComponent as PdfIcon } from "assets/icons/pdf.svg";
import { ReactComponent as ImageIcon } from "assets/icons/image.svg";
import { Button } from "components/Button";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import printJS from "print-js";

interface Props {
  table: Table;
  onClose: () => void;
}

export const TableQr: FC<Props> = memo(function TableQr(props) {
  const { table, onClose } = props;
  const { handleSaveAsJpg, handleSaveAsPdf, handlePrintClick } = useTableQr(
    props
  );
  const { t } = useTranslation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const url = `${process.env.REACT_APP_QR_BASE_URL}/${table.id}`;

  return (
    <div className={style.container}>
      <div className={style.header}>
        <Typography className={style.title}>{table.label}</Typography>
        <IconButton className={style.close} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <QRCode
        value={url}
        renderAs="canvas"
        className={style.qr}
        bgColor="rgba(0,0,0,0)"
        fgColor={primary}
        size={2048}
      />
      <div className={style.footer}>
        <Button
          className={style.action}
          startIcon={<PrinterIcon />}
          onClick={handlePrintClick}
        >
          {t("buttons.printQRCode")}
        </Button>

        <Button
          className={style.action}
          startIcon={<PdfIcon />}
          onClick={handleSaveAsPdf}
        >
          {t("buttons.saveAsPDF")}
        </Button>
        <Button
          className={style.action}
          startIcon={<ImageIcon />}
          onClick={handleSaveAsJpg}
        >
          {t("buttons.saveAsJPG")}
        </Button>
      </div>
    </div>
  );
});

function useTableQr({ table }: Props) {
  function getCanvas() {
    return document.querySelector<HTMLCanvasElement>(`.${style.qr}`);
  }

  function handlePrintClick() {
    const canvas = getCanvas();
    if (canvas) {
      const dataURL = canvas.toDataURL("image/jpg");
      printJS(dataURL, "image");
    }
  }

  function handleSaveAsJpg() {
    const canvas = getCanvas();
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpg");
      link.download = `${table.label}.jpg`;
      link.click();
      link.remove();
    }
  }

  function handleSaveAsPdf() {
    const canvas = getCanvas();
    if (canvas) {
      const { width, height } = canvas;
      const doc = new jsPDF({ format: [width, height] });
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const originalImgData = ctx.getImageData(0, 0, width, height);
        const modifiedImgData = ctx.getImageData(0, 0, width, height);

        const data = modifiedImgData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 255) {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          }
        }

        ctx.putImageData(modifiedImgData, 0, 0);
        doc.addImage(canvas, 0, 0, canvas.width, canvas.height);
        ctx.putImageData(originalImgData, 0, 0);
        doc.save(`${table.label}.pdf`);
      }
    }
  }

  return { handlePrintClick, handleSaveAsJpg, handleSaveAsPdf };
}
