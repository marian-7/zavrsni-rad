import { FC, memo } from "react";
import style from "../../../styles/pages/login/components/LoginInfoCard.module.scss";
import { Typography } from "@material-ui/core";

type Props = {
  title: string;
  content: string;
};

export const InfoCard: FC<Props> = memo(function LoginInfoCard({
  title,
  content,
}) {
  useInfoCard();

  return (
    <div className={style.card}>
      <Typography variant="h3" classes={{ root: style.title }}>
        {title}
      </Typography>
      <Typography variant="body1" classes={{ root: style.content }}>
        {content}
      </Typography>
    </div>
  );
});

function useInfoCard() {}
