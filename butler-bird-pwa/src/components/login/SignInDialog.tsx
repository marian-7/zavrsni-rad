import React, { FC, memo } from "react";
import { SocialSignIn } from "components/login/SocialSignIn";
import { Dialog } from "components/Dialog";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import style from "styles/components/login/sign-in-dialog.module.scss";

type Props = {
  isOpen: boolean;
  callbackUrl: string;
};

export const SignInDialog: FC<Props> = memo(function SignInDialog({ isOpen, callbackUrl }) {
  useSignInDialog();
  const { t } = useTranslation(["login", "common"]);
  const { back } = useRouter();

  return (
    <Dialog
      open={isOpen}
      onBack={back}
      backText={t("button.back", { ns: "common" })}
      containerClassName={style.root}
    >
      <Typography className="mb-3">{t("order")}</Typography>
      <SocialSignIn showInfoText={false} customCallbackUrl={callbackUrl} />
    </Dialog>
  );
});

function useSignInDialog() {}
