import { Page } from "components/Page";
import React, { FC, memo } from "react";
import { List } from "components/List";
import { useTranslation } from "react-i18next";
import { paths, withSlug } from "paths";
import { Switch } from "react-router-dom";
import { CustomRoute } from "components/CustomRoute";
import { PrinterCreatePage } from "pages/printerCreate/PrinterCreatePage";
import { PrinterPage } from "pages/printer/PrinterPage";
import { useQuery } from "react-query";
import { printersService } from "domain/services/printersService";
import { mapData } from "domain/util/axios";
import { Printer } from "domain/models/Printer";
import { PrinterListItem } from "pages/printers/components/PrinterListItem";

interface Props {}

const PrintersPage: FC<Props> = memo(function PrintersPage() {
  const { data } = usePrintersPage();
  const { t } = useTranslation();

  function renderPrinter(printer: Printer) {
    return <PrinterListItem key={printer.id} printer={printer} />;
  }

  return (
    <Page>
      <List
        title={t("pages.printers.title")}
        addNewTo={withSlug(paths.printerCreate())}
        listHeader={null}
      >
        {data?.map(renderPrinter)}
      </List>
      <Switch>
        <CustomRoute
          type="protected"
          path={withSlug(paths.printerCreate(), true)}
        >
          <PrinterCreatePage />
        </CustomRoute>
        <CustomRoute type="protected" path={withSlug(paths.printer(), true)}>
          <PrinterPage />
        </CustomRoute>
      </Switch>
    </Page>
  );
});

function usePrintersPage() {
  const { data } = useQuery("printers", () =>
    printersService.getAll().then(mapData)
  );

  return { data };
}

export default PrintersPage;
