import React, { FC, memo, useCallback } from "react";
import { SocialSignIn } from "components/login/SocialSignIn";
import style from "styles/components/anonymous-navigation.module.scss";
import { Dialog } from "components/Dialog";
import { Typography } from "@material-ui/core";
import { TextButton } from "components/TextButton";
import { useTranslation } from "next-i18next";
import { Steps } from "components/NavigationDialog";

type Props = {
  onClose: () => void;
  handleNavigation: (step: Steps) => void;
  showNavigation: boolean;
};

export const AnonymousInitialNavigation: FC<Props> = memo(function AnonymousInitialNavigation(
  props
) {
  const { goToSettings } = useAnonymousInitialNavigation(props);
  const { onClose, showNavigation } = props;
  const { t } = useTranslation("common");

  return (
    <Dialog open={showNavigation} onClose={onClose} containerClassName={style.root}>
      <SocialSignIn />
      <div className={style.options}>
        <Typography className={style.text}>{t("navigation.or")}</Typography>
        <TextButton onClick={goToSettings} label={t("navigation.settings")} />
      </div>
    </Dialog>
  );
});

function useAnonymousInitialNavigation(props: Props) {
  const { handleNavigation } = props;

  const goToSettings = useCallback(() => {
    return handleNavigation(Steps.Settings);
  }, [handleNavigation]);

  return { goToSettings };
}
