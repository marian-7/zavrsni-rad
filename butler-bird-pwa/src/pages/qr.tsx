import React, { memo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { QrScanner } from "components/QrScanner";
import { getDefaultPageProps } from "domain/serverSideProps";
import { Session } from "next-auth";

type Props = {
  session: Session;
};

const Qr: NextPage<Props> = memo(function Qr({ session }) {
  useQr();

  return <QrScanner session={session} />;
});

function useQr() {}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["qr", "common"]);
  return { props };
}

export default Qr;
