import { memo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { ReactComponent as QrIcon } from "assets/icons/qr-icon.svg";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import style from "styles/pages/qr-info.module.scss";
import { getDefaultPageProps } from "domain/serverSideProps";
import { paths } from "paths";
import { LinkButton } from "components/LinkButton";

type Props = {};

const QrInfo: NextPage<Props> = memo(function QrInfo() {
  const { t } = useTranslation("qr");
  useQrInfo();

  return (
    <div className={style.qrInfo}>
      <div className={style.container}>
        <QrIcon className={style.icon} />
        <Typography className={style.text}>{t("instructions")}</Typography>
        <LinkButton
          href={paths.qr()}
          fullWidth
          color="primary"
          variant="contained"
          children={t("button.openQr")}
        />
      </div>
    </div>
  );
});

function useQrInfo() {}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["qr", "common"]);
  return { props };
}

export default QrInfo;
