import React, { FC, memo } from "react";
import { useField } from "formik";
import { Staff } from "domain/models/Organization";
import { ChipsSelect } from "components/ChipsSelect";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import { useTranslation } from "react-i18next";
import { StaffChip } from "pages/settingsStaff/components/StaffChip";
import { paths, withSlug } from "paths";

interface Props {
  name: string;
}

export const FormikStaffSelect: FC<Props> = memo(function FormikStaffSelect(
  props
) {
  const { value, handleDelete } = useFormikStaffSelect(props);
  const { t } = useTranslation();

  function renderChip(staff: Staff) {
    return (
      <StaffChip key={staff.email} staff={staff} onDelete={handleDelete} />
    );
  }

  return (
    <ChipsSelect
      action={{
        label: t("buttons.inviteMore"),
        icon: <AddIcon />,
        to: withSlug(paths.settingsStaffInvite()),
      }}
    >
      {value.map(renderChip)}
    </ChipsSelect>
  );
});

function useFormikStaffSelect({ name }: Props) {
  const [{ value }, , { setValue }] = useField<Staff[]>(name);

  function handleDelete(staff: Staff) {
    setValue(value.filter((s) => s.email !== staff.email));
  }

  return { value, handleDelete };
}
