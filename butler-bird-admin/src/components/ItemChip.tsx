import { FC, memo } from "react";
import style from "../styles/components/Item.module.scss";
import { Chip, Typography } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";
import { ReactComponent as VisibilityIcon } from "assets/icons/visibility.svg";
import { LinkButton } from "./LinkButton";
import classNames from "classnames";

type Props = {
  id?: number;
  title?: string;
  subtitle?: string;
  onDelete: (id: number) => void;
  toItemsView?: string;
};

export const ItemChip: FC<Props> = memo(function Item(props) {
  const { title, subtitle, toItemsView } = props;
  const { handleDelete } = useItemChip(props);

  return (
    <Chip
      className={classNames(style.container, {
        [style.containerOnlyTitle]: !subtitle,
      })}
      deleteIcon={
        <DeleteIcon
          className={classNames(style.deleteIcon, {
            [style.deleteIconModified]: !!toItemsView,
          })}
        />
      }
      onDelete={handleDelete}
      classes={{ label: style.label }}
      label={
        <div className={style.label}>
          <div>
            <Typography className={style.name}>{title}</Typography>
            {subtitle && (
              <Typography className={style.itemLabel}>{subtitle}</Typography>
            )}
          </div>
          {!!toItemsView && (
            <LinkButton to={toItemsView} className={style.visibilityIcon}>
              <VisibilityIcon />
            </LinkButton>
          )}
        </div>
      }
    />
  );
});

function useItemChip({ onDelete, id }: Props) {
  function handleDelete() {
    if (id) {
      onDelete(id);
    }
  }

  return { handleDelete };
}
