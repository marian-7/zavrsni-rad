import { Chip } from "@material-ui/core";
import React, { FC, memo } from "react";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { Staff } from "domain/models/Organization";

interface Props {
  staff: Staff;
  onDelete: (staff: Staff) => void;
}

export const StaffChip: FC<Props> = memo(function StaffChip(props) {
  const { staff } = props;
  const { handleDelete } = useStaffChip(props);

  return (
    <Chip
      label={staff.email}
      onDelete={handleDelete}
      deleteIcon={<DeleteIcon />}
    />
  );
});

function useStaffChip({ staff, onDelete }: Props) {
  function handleDelete() {
    onDelete(staff);
  }

  return { handleDelete };
}
