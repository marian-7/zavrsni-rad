import React, { FC, memo } from "react";
import MuiRating from "@material-ui/lab/Rating";
import { RatingProps } from "@material-ui/lab";
import { ReactComponent as StarOutlineIcon } from "assets/icons/star-rate-outlined-icon.svg";
import { ReactComponent as StarIcon } from "assets/icons/star-filled-icon.svg";
import style from "styles/components/rating.module.scss";

type Props = RatingProps & {};

export const Rating: FC<Props> = memo(function Rating(props) {
  useRating();

  return (
    <MuiRating
      classes={{
        icon: style.icon,
      }}
      readOnly={false}
      icon={<StarIcon />}
      emptyIcon={<StarOutlineIcon />}
      {...props}
    />
  );
});

function useRating() {}
