import { memo, useCallback } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import style from "styles/pages/organization-feedback-page.module.scss";
import { getDefaultPageProps } from "domain/serverSideProps";
import { AppFeedback } from "components/feedback/AppFeedback";
import CloseIcon from "@material-ui/icons/Close";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { paths } from "paths";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useTable } from "hooks/useTable";
import { Session } from "next-auth";

type Props = {
  session: Session;
};

const AppFeedbackPage: NextPage<Props> = memo(function AppFeedbackPage({ session }) {
  const { goToTablePage } = useAppFeedbackPage();
  const { t } = useTranslation("common");

  return (
    <div className={style.root}>
      <div className={style.container}>
        <ButtonWithIcon className={style.btn} startIcon={<CloseIcon />} onClick={goToTablePage}>
          {t("button.close")}
        </ButtonWithIcon>
        <AppFeedback isOnPage session={session} />
      </div>
    </div>
  );
});

function useAppFeedbackPage() {
  const { replace } = useRouter();
  const { table } = useTable();

  const goToTablePage = useCallback(() => {
    if (table) {
      replace(paths.tables(table.id));
    }
  }, [replace, table]);

  return { goToTablePage };
}

export default AppFeedbackPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["common", "success"]);
  return { props };
}
