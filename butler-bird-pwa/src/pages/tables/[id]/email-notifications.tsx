import React, { memo, useMemo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { getDefaultPageProps } from "domain/serverSideProps";
import style from "styles/pages/email-notifications.module.scss";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { useRouter } from "next/router";
import { paths } from "paths";
import { useTable } from "hooks/useTable";
import { SocialSignIn } from "components/login/SocialSignIn";
import { ProvidersContext } from "context/ProvidersContext";
import { getProviders } from "next-auth/client";
import { AppProvider } from "next-auth/providers";

type Props = {
  providers: Record<string, AppProvider>;
};

const EmailNotificationsPage: NextPage<Props> = memo(function EmailNotifications({ providers }) {
  const { back, callbackUrl } = useEmailNotifications();
  const { t } = useTranslation("common");

  return (
    <div className={style.root}>
      <ButtonWithIcon startIcon={<ArrowBackIosIcon />} onClick={back} className={style.back}>
        {t("button.back")}
      </ButtonWithIcon>
      <ProvidersContext.Provider value={providers}>
        <SocialSignIn customCallbackUrl={callbackUrl} />
      </ProvidersContext.Provider>
    </div>
  );
});

function useEmailNotifications() {
  const { back } = useRouter();
  const { table } = useTable();

  const callbackUrl = useMemo(() => {
    return paths.orderPreview(table?.id);
  }, [table?.id]);

  return { back, callbackUrl };
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

export default EmailNotificationsPage;
