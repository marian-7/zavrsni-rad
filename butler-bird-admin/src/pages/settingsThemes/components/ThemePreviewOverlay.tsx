import { FC, memo, ReactElement } from "react";
import style from "styles/pages/settingsThemes/components/ThemePreviewOverlay.module.scss";
import { ReactComponent as ArrowLeft } from "assets/icons/arrow-back.svg";
import { ReactComponent as ArrowRight } from "assets/icons/arrow-forward.svg";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";
import { IconButton } from "@material-ui/core";

type Props = {
  preview: ReactElement;
  onClose: () => void;
  onClickRight: () => void;
  onClickLeft: () => void;
};

export const ThemePreviewOverlay: FC<Props> = memo(function PreviewOverlay(
  props
) {
  const { preview, onClickRight, onClickLeft, onClose } = props;
  useThemePreviewOverlay();

  return (
    <div className={style.container}>
      <IconButton className={style.closeBtn} onClick={onClose}>
        <CloseIcon className={style.closeIcon} />
      </IconButton>
      <IconButton className={style.arrowBtn} onClick={onClickLeft}>
        <ArrowLeft className={style.arrowIcon} />
      </IconButton>
      {preview}
      <IconButton className={style.arrowBtn} onClick={onClickRight}>
        <ArrowRight className={style.arrowIcon} />
      </IconButton>
    </div>
  );
});

function useThemePreviewOverlay() {}
