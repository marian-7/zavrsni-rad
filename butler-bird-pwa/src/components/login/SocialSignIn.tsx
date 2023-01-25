import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import React, { FC, memo, useCallback, useContext, useMemo } from "react";
import { signIn } from "next-auth/client";
import style from "styles/components/login/social-sign-in.module.scss";
import { paths } from "paths";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { ProvidersContext } from "context/ProvidersContext";

type Props = {
  showInfoText?: boolean;
  customCallbackUrl?: string;
};

export const SocialSignIn: FC<Props> = memo(function SocialSignIn(props) {
  const { showInfoText = true } = props;
  const { signInWithGoogle, signInWithFacebook } = useSocialSignIn(props);
  const { t } = useTranslation("login");

  return (
    <>
      {showInfoText && <Typography className={style.info}>{t("info")}</Typography>}
      <Button className={style.btnFb} fullWidth onClick={signInWithFacebook}>
        {t("button.facebook")}
      </Button>
      <Button className={style.btnGoogle} fullWidth onClick={signInWithGoogle}>
        {t("button.google")}
      </Button>
    </>
  );
});

function useSocialSignIn(props: Props) {
  const { customCallbackUrl } = props;
  const { query } = useRouter();

  const providers = useContext(ProvidersContext);

  const callbackUrl = useMemo(() => {
    if (typeof query.tableId === "string") {
      return paths.tables(query.tableId);
    }
  }, [query.tableId]);

  const signInWithGoogle = useCallback(() => {
    signIn(providers["google"]?.id, { callbackUrl: customCallbackUrl ?? callbackUrl });
  }, [callbackUrl, customCallbackUrl, providers]);

  const signInWithFacebook = useCallback(() => {
    signIn(providers["facebook"]?.id, { callbackUrl: customCallbackUrl ?? callbackUrl });
  }, [callbackUrl, customCallbackUrl, providers]);

  return { callbackUrl, providers, signInWithGoogle, signInWithFacebook };
}
