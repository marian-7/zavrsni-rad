import React, { FC, memo } from "react";
import { DialogProps, Dialog as MuiDialog } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { useTranslation } from "next-i18next";
import style from "styles/components/dialog.module.scss";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import classNames from "classnames";

type Props = DialogProps & {
  onClose?: () => void;
  onBack?: () => void;
  closeText?: string;
  noBottomPadding?: boolean;
  noPadding?: boolean;
  backText?: string;
  topClassName?: string;
  containerClassName?: string;
};

export const Dialog: FC<Props> = memo(function Dialog(props) {
  useDialog();
  const { t } = useTranslation("common");
  const {
    children,
    onClose,
    onBack,
    noPadding,
    noBottomPadding,
    closeText = t("button.close", { ns: "common" }),
    backText = t("button.back", { ns: "common" }),
    className,
    topClassName,
    containerClassName,
    ...rest
  } = props;

  return (
    <MuiDialog
      {...rest}
      fullScreen
      classes={{
        paper: classNames(style.dialog, className, {
          [style.noBottomPadding]: noBottomPadding,
          [style.noPadding]: noPadding,
        }),
      }}
    >
      <div className={classNames(style.top, topClassName)}>
        {onBack && (
          <ButtonWithIcon
            startIcon={<ArrowBackIosIcon />}
            className={classNames(style.iconBtn, style.back)}
            onClick={onBack}
          >
            {backText}
          </ButtonWithIcon>
        )}
        {onClose && (
          <ButtonWithIcon
            startIcon={<CloseIcon />}
            className={classNames(style.iconBtn, style.close)}
            onClick={onClose}
          >
            {closeText}
          </ButtonWithIcon>
        )}
      </div>

      {containerClassName ? <div className={containerClassName}>{children}</div> : children}
    </MuiDialog>
  );
});

function useDialog() {}
