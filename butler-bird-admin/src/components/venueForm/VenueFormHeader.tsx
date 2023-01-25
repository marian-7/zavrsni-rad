import React, { FC, memo } from "react";
import style from "styles/components/SinglePageHeader.module.scss";
import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import { ReactComponent as DeleteIcon } from "assets/icons/highlight-off.svg";
import { useTranslation } from "react-i18next";

interface Props {
  create: boolean;
  isSubmitting: boolean;
  name?: string;
  location?: string;
  onDeleteClick?: () => void;
}

export const VenueFormHeader: FC<Props> = memo(function VenueFormHeader(props) {
  const { name, location, create, isSubmitting, onDeleteClick } = props;
  useVenueFormHeader();
  const { t } = useTranslation();

  return (
    <div className={style.header}>
      <div className="flex-1 flex-direction-column align-self-stretch">
        <Typography className={style.label}>{name}</Typography>
        <Typography>{location}</Typography>
      </div>
      {!create && (
        <Button
          startIcon={<DeleteIcon />}
          color="primary"
          variant="text"
          className={style.delete}
          disabled={isSubmitting}
          onClick={onDeleteClick}
        >
          {t("buttons.delete")}
        </Button>
      )}
      <Button
        color="primary"
        variant="contained"
        className={style.save}
        type="submit"
        loading={isSubmitting}
      >
        {t("buttons.saveChanges")}
      </Button>
    </div>
  );
});

function useVenueFormHeader() {}
