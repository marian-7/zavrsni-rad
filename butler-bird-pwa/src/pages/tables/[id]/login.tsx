import React, { memo, useMemo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { getDefaultPageProps } from "domain/serverSideProps";
import style from "styles/pages/login-page.module.scss";
import { paths } from "paths";
import { getProviders } from "next-auth/client";
import { AppProvider } from "next-auth/providers";
import { SocialSignIn } from "components/login/SocialSignIn";
import { ProvidersContext } from "context/ProvidersContext";
import { useTable } from "hooks/useTable";

type Props = {
  providers: Record<string, AppProvider>;
};

const Login: NextPage<Props> = memo(function Login({ providers }) {
  const { callbackUrl } = useLogin();
  const { t } = useTranslation("login");

  return (
    <div className={style.login}>
      <div className={style.container}>
        <Typography className="mb-3">{t("loginRequired")}</Typography>
        <ProvidersContext.Provider value={providers}>
          <SocialSignIn showInfoText={false} customCallbackUrl={callbackUrl} />
        </ProvidersContext.Provider>
      </div>
    </div>
  );
});

function useLogin() {
  const { table } = useTable();

  const callbackUrl = useMemo(() => {
    if (table) {
      return paths.tables(table.id);
    }
  }, [table]);

  return { callbackUrl };
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
