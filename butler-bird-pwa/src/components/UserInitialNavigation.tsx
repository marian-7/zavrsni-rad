import React, { FC, memo, useCallback } from "react";
import { Steps } from "components/NavigationDialog";
import { useTranslation } from "next-i18next";
import { TextButton } from "components/TextButton";
import style from "styles/components/user-initial-navigation.module.scss";
import { Dialog } from "components/Dialog";

type Props = {
  handleNavigation: (step: Steps) => void;
  onClose: () => void;
  isOpen: boolean;
};

export const UserInitialNavigation: FC<Props> = memo(function UserInitialNavigation(props) {
  const { goToMyProfile, goToSettings } = useUserInitialNavigation(props);
  const { t } = useTranslation("common");
  const { onClose, isOpen } = props;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={style.dialog}
      containerClassName={style.root}
    >
      <TextButton onClick={goToMyProfile} label={t("navigation.myProfile")} />
      <TextButton onClick={goToSettings} label={t("navigation.settings")} />
    </Dialog>
  );
});

function useUserInitialNavigation(props: Props) {
  const { handleNavigation } = props;
  const goToMyProfile = useCallback(() => {
    return handleNavigation(Steps.MyProfile);
  }, [handleNavigation]);

  const goToSettings = useCallback(() => {
    return handleNavigation(Steps.Settings);
  }, [handleNavigation]);

  return { goToMyProfile, goToSettings };
}
