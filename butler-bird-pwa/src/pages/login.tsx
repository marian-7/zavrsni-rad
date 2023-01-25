import React, { memo, useCallback } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { getDefaultPageProps } from "domain/serverSideProps";
import style from "styles/pages/login-page.module.scss";
import { paths } from "paths";
import { useRouter } from "next/router";
import { getProviders } from "next-auth/client";
import { AppProvider } from "next-auth/providers";
import { SocialSignIn } from "components/login/SocialSignIn";
import { ProvidersContext } from "context/ProvidersContext";
import { Button } from "components/Button";

type Props = {
  providers: Record<string, AppProvider>;
};

const Login: NextPage<Props> = memo(function Login({ providers }) {
  const { handleClick } = useLogin();
  const { t } = useTranslation("login");

  return (
    <div className={style.login}>
      <div className={style.container}>
        <ProvidersContext.Provider value={providers}>
          <SocialSignIn />
        </ProvidersContext.Provider>
        <Typography className={style.text}>{t("or")}</Typography>
        <Button onClick={handleClick} fullWidth color="secondary" variant="contained">
          {t("button.skip")}
        </Button>
      </div>
    </div>
  );
});

function useLogin() {
  const { query, push } = useRouter();

  const handleClick = useCallback(() => {
    if (typeof query.tableId === "string") {
      return push(paths.tables(query.tableId));
    }
  }, [push, query.tableId]);

  return { handleClick };
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["common", "login"]);
  const providers = await getProviders();
  return {
    props: {
      ...props,
      providers,
    },
  };
}

export default Login;
