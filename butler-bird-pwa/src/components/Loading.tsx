import React, { FC, memo } from "react";
import { Dialog } from "components/Dialog";
import { CircularProgress, Typography } from "@material-ui/core";
import style from "styles/components/loading.module.scss";

type Props = {
  isLoading: boolean;
  label: string;
};

export const Loading: FC<Props> = memo(function Loading({ isLoading, label }) {
  useLoading();

  return (
    <Dialog open={isLoading} className={style.root}>
      <div className={style.container}>
        <CircularProgress color="primary" size="4.5rem" className={style.icon} />
        <Typography className={style.text}>{label}</Typography>
      </div>
    </Dialog>
  );
});

function useLoading() {}
