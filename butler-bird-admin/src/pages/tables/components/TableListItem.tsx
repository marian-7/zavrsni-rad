import React, { CSSProperties, FC, memo, useState } from "react";
import { Table, Venue } from "domain/models/Venue";
import itemStyle from "styles/components/PickerListItem.module.scss";
import { IconButton, Typography } from "@material-ui/core";
import style from "styles/pages/tables/components/TableListItem.module.scss";
import classNames from "classnames";
import { ReactComponent as QrIcon } from "assets/icons/qr-code-scanner.svg";
import { ReactComponent as EditIcon } from "assets/icons/edit.svg";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";
import { useToggleState } from "hooks/useToggleState";
import { Form, Formik } from "formik";
import { FormikInput } from "components/FormikInput";
import { tableSchema } from "domain/util/validators";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useWillUnmount } from "hooks/useWillUnmount";
import { Checkbox } from "components/Checkbox";
import { Button } from "components/Button";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { ReactComponent as SaveIcon } from "assets/icons/done.svg";
import { useTranslation } from "react-i18next";

interface Props {
  data: {
    tables: Table[];
    onRemoveClick: (table: Table) => Promise<void>;
    onChange: (table: Table) => Promise<void>;
    onQrClick: (table: Table) => void;
    onCheckboxClick: (table: Table) => void;
    selectedTables: Table[];
    venue: Partial<Venue>;
  };
  index: number;
  style: CSSProperties;
}

export const TableListItem: FC<Props> = memo(function TableListItem(props) {
  const {
    handleRemoveClick,
    editing,
    toggleEditing,
    handleSubmit,
    table,
    handleQrClick,
    removing,
    t,
    handleCheckboxClick,
    isChecked,
    updating,
  } = useTableListItem(props);
  const { data } = props;

  return (
    <div
      style={props.style}
      className={classNames(itemStyle.item, style.item, {
        [style.itemEditing]: editing,
      })}
    >
      {editing ? (
        <Formik
          onSubmit={handleSubmit}
          initialValues={table}
          validationSchema={tableSchema}
        >
          <Form className={style.form}>
            <FormikInput
              autoFocus
              name="label"
              className={style.input}
              withHelperText={false}
            />
            <div className={style.actions}>
              {updating ? (
                <CircularProgress className={style.updating} size={14} />
              ) : (
                <Button
                  type="submit"
                  startIcon={<SaveIcon className={style.actionIcon} />}
                  rootClassName={classNames(style.btn, style.btnSave)}
                >
                  {t("buttons.save")}
                </Button>
              )}
              <Button
                startIcon={<DeleteIcon className={style.actionIcon} />}
                onClick={toggleEditing}
                rootClassName={classNames(style.btn, style.btnCancel)}
                disabled={updating}
              >
                {t("buttons.cancel")}
              </Button>
            </div>
          </Form>
        </Formik>
      ) : (
        <>
          <Checkbox onClick={handleCheckboxClick} checked={isChecked} />
          <div className={style.details}>
            <Typography
              title={table.label}
              className={classNames(itemStyle.label, style.label)}
            >
              {table.label}
            </Typography>
            <Typography className={style.detailsId}>
              {t("pages.tables.id", { id: table.id })}
            </Typography>
          </div>
          <IconButton
            color="primary"
            className={style.action}
            disabled={editing || removing}
            onClick={handleQrClick}
          >
            <QrIcon />
          </IconButton>
          {!data.venue.takeout && (
            <>
              <IconButton
                disabled={editing || removing}
                color="primary"
                className={style.action}
                onClick={toggleEditing}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                disabled={editing || removing}
                color="primary"
                className={classNames(style.action, style.actionAlert)}
                onClick={handleRemoveClick}
              >
                {removing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <HighlightOffIcon />
                )}
              </IconButton>
            </>
          )}
        </>
      )}
    </div>
  );
});

function useTableListItem({ index, data }: Props) {
  const { t } = useTranslation();
  const {
    tables,
    onChange,
    onRemoveClick,
    onQrClick,
    onCheckboxClick,
    selectedTables,
  } = data;
  const [removing, setRemoving] = useState(false);
  const table = tables[index];
  const [editing, toggleEditing] = useToggleState(false, [true, false]);
  const [updating, setUpdating] = useState(false);
  const { current: willUnmount } = useWillUnmount();

  function handleRemoveClick() {
    if (removing) {
      return;
    }
    setRemoving(true);
    onRemoveClick(table).catch(() => {
      if (!willUnmount) {
        setRemoving(false);
      }
    });
  }

  function handleSubmit(values: Table) {
    setUpdating(true);
    return onChange(values).then(() => {
      setUpdating(false);
      toggleEditing();
    });
  }

  function handleQrClick() {
    onQrClick(table);
  }

  function handleCheckboxClick() {
    onCheckboxClick(table);
  }

  const isChecked = selectedTables.includes(table);

  return {
    handleRemoveClick,
    editing,
    toggleEditing,
    handleSubmit,
    table,
    handleQrClick,
    removing,
    t,
    handleCheckboxClick,
    isChecked,
    updating,
  };
}
