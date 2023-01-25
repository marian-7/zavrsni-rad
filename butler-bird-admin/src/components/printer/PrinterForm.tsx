import React, { FC, memo } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import singlePageStyle from "styles/components/SinglePage.module.scss";
import { useFormikContext } from "formik";
import { PrinterFormHeader } from "components/printer/PrinterFormHeader";
import { FormikInput } from "components/FormikInput";
import { useTranslation } from "react-i18next";
import { IconButton, Typography } from "@material-ui/core";
import style from "styles/components/printer/PrinterForm.module.scss";
import { ReactComponent as HelpIcon } from "assets/icons/help-outline.svg";
import classNames from "classnames";
import { OrderListHeader } from "pages/orders/components/OrderListHeader";
import inputStyle from "styles/components/Input.module.scss";
import { Form } from "components/Form";
import { DeleteOverlay } from "components/DeleteOverlay";
import { useToggleState } from "hooks/useToggleState";
import { FormikSingleSelect } from "components/FormikSingleSelect";
import { useOrganization } from "hooks/useOrganization";

export interface PrinterFormValues {
  name: string;
  serialNumber: string;
  language: string;
  triggerLocations: number[];
  triggerVenues: number[];
  triggerTables: number[];
}

interface Props {
  create: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
}

export const PrinterForm: FC<Props> = memo(function PrinterForm(props) {
  const { create, onDelete, isDeleting } = props;
  const {
    handleLocationsChange,
    handleVenuesChange,
    handleTablesChange,
    values,
    deleteOverlay,
    toggleDeleteOverlay,
    languages,
  } = usePrinterForm();
  const { t } = useTranslation();

  return (
    <OverlayScrollbarsComponent
      className={singlePageStyle.container}
      options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
    >
      <Form className={singlePageStyle.form}>
        <PrinterFormHeader
          create={create}
          onDeleteClick={toggleDeleteOverlay}
        />
        <div className={singlePageStyle.body}>
          <FormikInput
            name="name"
            label={t("form.labels.name")}
            className={singlePageStyle.input}
          />
          <FormikInput
            label={
              <>
                {t("form.labels.deviceSN")}
                <IconButton
                  className={style.help}
                  color="primary"
                  component="span"
                >
                  <HelpIcon />
                </IconButton>
              </>
            }
            name="serialNumber"
            className={classNames(singlePageStyle.input, style.inputWithHelp)}
          />
          <FormikSingleSelect
            label={t("form.labels.language")}
            name="language"
            options={languages}
            className={classNames(singlePageStyle.select)}
          />
          <Typography className={inputStyle.label}>
            {t("form.labels.filter")}
          </Typography>
          <OrderListHeader
            spacingClassName={style.selectsSpacing}
            containerClassName={style.selectsContainer}
            selectClassName={style.selectsSelect}
            locations={values.triggerLocations}
            locationsPlaceholder={t("form.placeholders.selectLocations")}
            onLocationsChange={handleLocationsChange}
            venues={values.triggerVenues}
            venuesPlaceholder={t("form.placeholders.selectVenues")}
            onVenuesChange={handleVenuesChange}
            tables={values.triggerTables}
            tablesPlaceholder={t("form.placeholders.selectTables")}
            onTablesChange={handleTablesChange}
          />
        </div>
        {onDelete && deleteOverlay && (
          <DeleteOverlay
            name={t("pages.printer.printer")}
            onDelete={onDelete}
            onCancelDelete={toggleDeleteOverlay}
            deleting={isDeleting}
          />
        )}
      </Form>
    </OverlayScrollbarsComponent>
  );
});

function usePrinterForm() {
  const organization = useOrganization();
  const { t } = useTranslation();
  const [deleteOverlay, toggleDeleteOverlay] = useToggleState(false, [
    true,
    false,
  ]);
  const { setFieldValue, values } = useFormikContext<PrinterFormValues>();

  const languages =
    organization?.languages.map((value) => ({
      value,
      label: t(`languages.${value}`),
    })) ?? [];

  function handleLocationsChange(values: number[]) {
    setFieldValue("triggerLocations", values);
  }

  function handleVenuesChange(values: number[]) {
    setFieldValue("triggerVenues", values);
  }

  function handleTablesChange(values: number[]) {
    setFieldValue("triggerTables", values);
  }

  return {
    handleLocationsChange,
    handleVenuesChange,
    handleTablesChange,
    values,
    deleteOverlay,
    toggleDeleteOverlay,
    languages,
  };
}
