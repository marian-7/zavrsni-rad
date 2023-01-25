import React, { FC, memo } from "react";
import { Menu } from "domain/models/Menu";
import { Chip, IconButton, Typography } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { ReactComponent as VisibilityIcon } from "assets/icons/visibility.svg";
import { useLocal } from "hooks/useLocal";
import { useTranslation } from "react-i18next";
import style from "styles/components/venueForm/MenuChip.module.scss";
import { NavLink as Link } from "react-router-dom";
import { getLabel } from "domain/util/text";

interface Props {
  menu: Menu;
  onDelete: (id: number) => void;
  viewPath: string;
}

export const MenuChip: FC<Props> = memo(function MenuChip(props) {
  const { menu, viewPath } = props;
  const { handleDelete } = useMenuChip(props);
  const { local } = useLocal();
  const { t } = useTranslation();

  return (
    <Chip
      classes={{ root: style.root, label: style.label }}
      label={
        <>
          <div className="d-flex flex-direction-column">
            {getLabel(menu.name, local)}
            <Typography component="span" className={style.items}>
              {t("pages.venue.menuItem", { count: menu.itemCount })}
            </Typography>
          </div>
          <IconButton
            component={Link}
            to={viewPath}
            color="primary"
            className={style.icon}
          >
            <VisibilityIcon />
          </IconButton>
        </>
      }
      onDelete={handleDelete}
      deleteIcon={<DeleteIcon />}
    />
  );
});

function useMenuChip({ menu, onDelete }: Props) {
  function handleDelete() {
    onDelete(menu.id);
  }

  return { handleDelete };
}
