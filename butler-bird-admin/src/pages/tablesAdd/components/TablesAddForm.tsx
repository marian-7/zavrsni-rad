import { Form, useFormikContext } from "formik";
import React, { FC, memo } from "react";
import style from "styles/pages/tablesAdd/components/TablesAddForm.module.scss";
import { FormikInput } from "components/FormikInput";
import { FormikIntegerInput } from "components/FormikIntegerInput";
import { IconButton, Typography } from "@material-ui/core";
import { ReactComponent as HelpIcon } from "assets/icons/help-outline.svg";
import { useTranslation } from "react-i18next";
import { Button } from "components/Button";
import { NavLink as Link } from "react-router-dom";
import sidePageStyle from "styles/components/SidePage.module.scss";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";
import { ReactComponent as DoneIcon } from "assets/icons/done.svg";
import { ReactComponent as SyncIcon } from "assets/icons/sync.svg";

interface Props {
  cancelPath: string;
}

export const TablesAddForm: FC<Props> = memo(function TablesAddForm(props) {
  const { cancelPath } = props;
  const { isSubmitting } = useTablesAddForm();
  const { t } = useTranslation();

  return (
    <Form className={style.form}>
      <FormikIntegerInput
        showErrorOnTouched
        label={t("form.labels.addNumberOfTables")}
        name="quantity"
        className={style.quantity}
      />
      <FormikInput
        showErrorOnTouched
        label={
          <>
            {t("form.labels.tableNameTemplate")}
            <IconButton className={style.help} color="primary" component="span">
              <HelpIcon />
            </IconButton>
          </>
        }
        name="template"
        className={style.temple}
      />
      <div className={style.actions}>
        {isSubmitting ? (
          <div className="d-flex align-item-center mr-1 mt-1">
            <SyncIcon className={style.syncIcon} />
            <Typography>{t("pages.tables.adding")}</Typography>
          </div>
        ) : (
          <>
            <Button
              component={Link}
              to={cancelPath}
              className={sidePageStyle.button}
              startIcon={<HighlightOffIcon />}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              className={sidePageStyle.button}
              color="primary"
              startIcon={<DoneIcon />}
              type="submit"
            >
              {t("buttons.addTables")}
            </Button>
          </>
        )}
      </div>
    </Form>
  );
});

function useTablesAddForm() {
  const { isSubmitting } = useFormikContext();

  return { isSubmitting };
}
