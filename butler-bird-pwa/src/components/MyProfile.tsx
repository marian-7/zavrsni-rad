import React, { FC, memo, useCallback } from "react";
import { Steps } from "components/NavigationDialog";
import { useTranslation } from "next-i18next";
import { Typography } from "@material-ui/core";
import style from "styles/components/my-profile.module.scss";
import { signOut } from "next-auth/client";
import { TextButton } from "components/TextButton";
import { Dialog } from "components/Dialog";
import { userIdentification } from "domain/services/userIdentification";
import { paths } from "paths";
import { useTable } from "hooks/useTable";
import * as querystring from "querystring";
import { useRouter } from "hooks/useRouter";
import { LocationQuery } from "components/location/UserLocationList";

type Props = {
  handleNavigation: (step: Steps) => void;
  isOpen: boolean;
  onClose: () => void;
};

export const MyProfile: FC<Props> = memo(function MyProfile(props) {
  const {
    goToFeedback,
    goToOrderHistory,
    handleBack,
    handleLogout,
    goToMyAddress,
    deleteProfile,
  } = useMyProfile(props);
  const { isOpen, onClose } = props;
  const { t } = useTranslation("common");

  return (
    <Dialog open={isOpen} onClose={onClose} onBack={handleBack} containerClassName={style.root}>
      <Typography className={style.text}>{t("navigation.myProfile")}</Typography>
      <TextButton onClick={goToOrderHistory} label={t("navigation.orderHistory")} />
      <TextButton onClick={goToMyAddress} label={t("navigation.address")} />
      <TextButton onClick={goToFeedback} label={t("navigation.feedback")} />
      <TextButton onClick={handleLogout} label={t("navigation.signOut")} />

      <div className={style.options}>
        <Typography className={style.decoratedText}>{t("navigation.otherOptions")}</Typography>
        <TextButton label={t("navigation.deleteProfile")} onClick={deleteProfile} />
      </div>
    </Dialog>
  );
});

function useMyProfile(props: Props) {
  const { handleNavigation } = props;
  const { back, push } = useRouter();
  const { table } = useTable();

  const handleLogout = useCallback(async () => {
    await userIdentification.remove();
    await signOut();
  }, []);

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const goToFeedback = useCallback(() => {
    handleNavigation(Steps.Feedback);
  }, [handleNavigation]);

  const goToOrderHistory = useCallback(() => {
    handleNavigation(Steps.OrderHistory);
  }, [handleNavigation]);

  const deleteProfile = useCallback(async () => {
    await push(paths.deleteProfile());
  }, [push]);

  const goToMyAddress = useCallback(async () => {
    if (table) {
      await push(
        `${paths.locationsList(table.id)}?${querystring.stringify({
          from: LocationQuery.Navigation,
        })}`
      );
    }
  }, [push, table]);

  return { goToFeedback, goToOrderHistory, handleBack, handleLogout, goToMyAddress, deleteProfile };
}
