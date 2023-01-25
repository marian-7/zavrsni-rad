import React, { FC, memo } from "react";
import { Button } from "components/Button";
import { useTranslation } from "next-i18next";
import { useMenu } from "hooks/useMenu";
import style from "styles/components/menu/menu-controls.module.scss";
import classNames from "classnames";

type Props = {
  onCallStaff: () => void;
  showCallStaffButton: boolean;
};

export const MenuControls: FC<Props> = memo(function MenuControls({
  onCallStaff,
  showCallStaffButton,
}) {
  const { onClick } = useMenuControls();
  const { t } = useTranslation("menu");

  return (
    <div className={classNames(style.root)}>
      {showCallStaffButton && (
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          className={style.btn}
          onClick={onCallStaff}
        >
          {t("button.callStaff")}
        </Button>
      )}
      <Button color="secondary" variant="contained" onClick={onClick} fullWidth>
        {t("button.filter")}
      </Button>
    </div>
  );
});

function useMenuControls() {
  const { onShowModal } = useMenu();

  return { onClick: onShowModal };
}
