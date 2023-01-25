import { useTranslation } from "next-i18next";
import { GetServerSidePropsContext, NextPage } from "next";
import style from "styles/pages/index-page.module.scss";
import React from "react";
import { TableInputForm } from "components/welcome/TableInputForm";
import { getDefaultPageProps } from "domain/serverSideProps";
import { Session } from "next-auth";
import { Typography } from "@material-ui/core";
import { Header } from "components/Header";

type Props = {
  session: Session;
};

const Home: NextPage<Props> = ({ session }) => {
  const { t } = useTranslation(["index"]);
  useHome();

  return (
    <div className={style.loginPage}>
      <div className={style.container}>
        <Header containerClassName={style.header} appLogo />
        <div className={style.tablePicker}>
          <div className={style.textContainer}>
            <Typography variant="h2" className={style.title}>
              {t("title")}
            </Typography>
            <Typography className={style.text}>{t("info")}</Typography>
          </div>
          <TableInputForm session={session} />
        </div>
      </div>
    </div>
  );
};

function useHome() {}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["common", "index", "languages"]);
  return { props };
}

export default Home;
