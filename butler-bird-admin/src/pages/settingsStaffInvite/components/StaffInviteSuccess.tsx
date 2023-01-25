import React, { FC, memo } from "react";
import style from "styles/pages/settingsStaffInvite/components/StaffInviteSuccess.module.scss";
import { ReactComponent as CheckIcon } from "assets/icons/check-circle.svg";
import { Typography } from "@material-ui/core";
import sidePageStyle from "styles/components/SidePage.module.scss";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import { Button } from "components/Button";
import { Trans, useTranslation } from "react-i18next";

interface Props {
  email: string;
  onInviteMoreClick: () => void;
}

export const StaffInviteSuccess: FC<Props> = memo(function StaffInviteSuccess({
  email,
  onInviteMoreClick,
}) {
  useStaffInviteSuccess();
  const { t } = useTranslation();

  return (
    <div className={style.root}>
      <CheckIcon className={style.icon} />
      <Typography className={style.text}>
        <Trans
          i18nKey="pages.settingsStaffInvite.emailSent"
          values={{ email }}
          components={{
            b: <Typography component="span" className={style.textBold} />,
          }}
        />
      </Typography>
      <Button
        onClick={onInviteMoreClick}
        className={sidePageStyle.button}
        color="primary"
        startIcon={<AddIcon />}
        type="submit"
      >
        {t("buttons.inviteMore")}
      </Button>
    </div>
  );
});

function useStaffInviteSuccess() {}
