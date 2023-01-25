import { memo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { getDefaultPageProps } from "domain/serverSideProps";

type Props = {};

const Profile: NextPage<Props> = memo(function Profile() {
  useProfile();
  return <div />;
});

function useProfile() {}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["common", "login"], true);
  return { props };
}

export default Profile;
