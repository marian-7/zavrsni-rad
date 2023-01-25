import React, { FC, memo } from "react";
import { Chip } from "@material-ui/core";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";

interface Props {
  label: string;
  onDelete: () => void;
}

export const LocationChip: FC<Props> = memo(function LocationChip({
  label,
  onDelete,
}) {
  useLocationChip();

  return <Chip label={label} onDelete={onDelete} deleteIcon={<DeleteIcon />} />;
});

function useLocationChip() {}
