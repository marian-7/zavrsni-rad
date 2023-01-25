import { ChipsSelect, ChipsSelectProps } from "components/ChipsSelect";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "domain/models/Venue";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import { ReactComponent as EditIcon } from "assets/icons/edit.svg";
import { Chip } from "@material-ui/core";
import { useField } from "formik";

interface Props extends ChipsSelectProps {
  name: string;
  addTo: string;
  editTo: string;
}

export const FormikTablesSelect: FC<Props> = memo(function FormikTablesSelect(
  props
) {
  const { addTo, editTo, ...rest } = props;
  const { value } = useFormikTablesSelect(props);
  const { t } = useTranslation();

  return (
    <ChipsSelect
      label={t("form.labels.tablesSelect")}
      action={[
        {
          label: t("buttons.addTables"),
          icon: <AddIcon />,
          to: addTo,
        },
        {
          label: t("buttons.editTables"),
          icon: <EditIcon />,
          to: editTo,
        },
      ]}
      {...rest}
    >
      {value && (
        <Chip label={t("pages.venue.table", { count: value.length })} />
      )}
    </ChipsSelect>
  );
});

function useFormikTablesSelect({ name }: Props) {
  const [{ value }] = useField<Table[]>(name);

  return { value };
}
