import { memo, useCallback, useMemo } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { DeleteProfile } from "components/DeleteProfile";
import { useRouter } from "next/router";
import { Steps } from "components/NavigationDialog";
import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import { paths } from "paths";
import * as queryString from "querystring";
import { getDefaultPageProps } from "domain/serverSideProps";
import { useTranslation } from "next-i18next";
import style from "styles/pages/delete.module.scss";
import CloseIcon from "@material-ui/icons/ArrowBackIos";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { Session } from "next-auth";

type Props = {
  session?: Session;
};

const Delete: NextPage<Props> = memo(function Delete({ session }) {
  const { current, back, handleDelete } = useDelete();
  const { t } = useTranslation(["data", "common"]);

  return (
    <div className={style.root}>
      <div className={style.pageContainer}>
        <ButtonWithIcon className={style.btn} startIcon={<CloseIcon />} onClick={back}>
          {t("button.back", { ns: "common" })}
        </ButtonWithIcon>
        <div className={style.container}>
          <Typography className={style.text}>{t("info")}</Typography>
          <Button
            disabled={!session}
            variant="contained"
            onClick={handleDelete}
            className={style.button}
            fullWidth
          >
            {t("button.delete")}
          </Button>
          <DeleteProfile isOpen={current === Steps.DeleteProfile} onClose={back} />
        </div>
      </div>
    </div>
  );
});

function useDelete() {
  const { query, back, push } = useRouter();

  const current = useMemo(() => {
    return query.modal;
  }, [query.modal]);

  const handleDelete = useCallback(async () => {
    await push(`${paths.deleteProfile()}?${queryString.stringify({ modal: Steps.DeleteProfile })}`);
  }, [push]);

  return { current, back, handleDelete };
}

export default Delete;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const props = await getDefaultPageProps(ctx, ["data", "common"], false);

  return {
    props: {
      ...props,
    },
  };
}
