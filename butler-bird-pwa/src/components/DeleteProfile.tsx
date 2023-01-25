import React, { FC, memo, useCallback, useMemo } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { useTranslation } from "next-i18next";
import { useMutation } from "react-query";
import { deleteUserProfile } from "domain/services/userService";
import { Message } from "components/Message";
import { useRouter } from "next/router";
import { ReactComponent as CancelIcon } from "assets/icons/cancel-icon.svg";
import { signOut, useSession } from "next-auth/client";
import style from "styles/components/delete-profile.module.scss";
import { get } from "lodash";
import { useTheme } from "@material-ui/core";
import { userIdentification } from "domain/services/userIdentification";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const DeleteProfile: FC<Props> = memo(function DeleteProfile(props) {
  const { isOpen } = props;
  const { deleteProfile, cancel, isLoading, errorColor } = useDeleteProfile();
  const { t } = useTranslation("common");

  return (
    <Dialog open={isOpen} noPadding containerClassName={style.root}>
      <Message
        icon={<CancelIcon />}
        message={t("navigation.deleteInfo")}
        customColor={errorColor}
        mainButton={
          <Button
            className={style.btnContained}
            variant="contained"
            onClick={deleteProfile}
            disabled={isLoading}
            fullWidth
          >
            {t("navigation.deleteProfile")}
          </Button>
        }
        secondButton={
          <Button fullWidth onClick={cancel} className={style.btn}>
            {t("navigation.cancelDelete")}
          </Button>
        }
      />
    </Dialog>
  );
});

function useDeleteProfile() {
  const theme = useTheme();

  const { back } = useRouter();
  const [session] = useSession();

  const cancel = useCallback(() => {
    back();
  }, [back]);

  const { mutate, isLoading } = useMutation(async () => {
    try {
      if (session) {
        await userIdentification.remove();
        await deleteUserProfile(session.accessToken);
        await signOut({ callbackUrl: "/", redirect: true });
      }
    } catch (error) {
      throw error;
    }
  });

  const deleteProfile = useCallback(() => {
    mutate();
  }, [mutate]);

  const errorColor = useMemo(() => {
    return get(theme, "palette.error.main");
  }, [theme]);

  return { cancel, deleteProfile, isLoading, errorColor };
}
