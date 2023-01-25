import React, { FC, memo } from "react";
import { PrinterForm, PrinterFormValues } from "components/printer/PrinterForm";
import { Formik } from "formik";
import { printerSchema } from "domain/util/validators";
import { useMutation, useQueryClient } from "react-query";
import {
  CreatePrinterData,
  printersService,
} from "domain/services/printersService";
import { Printer } from "domain/models/Printer";
import { mapData } from "domain/util/axios";
import { useHistory } from "react-router-dom";
import { paths, withSlug } from "paths";
import { nextTick } from "util/nextTick";

interface Props {}

export const PrinterCreatePage: FC<Props> = memo(function PrinterCreatePage() {
  const { initialValues, handleSubmit } = usePrinterCreatePage();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={printerSchema}
    >
      <PrinterForm create />
    </Formik>
  );
});

function usePrinterCreatePage() {
  const { replace } = useHistory();
  const qc = useQueryClient();
  const { mutateAsync: create } = useMutation<
    Printer,
    unknown,
    CreatePrinterData
  >((data) => printersService.create(data).then(mapData), {
    onSuccess: (data) => {
      qc.setQueryData<Printer[]>("printers", (old) => (old ?? []).concat(data));
      nextTick(() => replace(withSlug(paths.printer(data.id))));
    },
  });

  const initialValues: PrinterFormValues = {
    name: "",
    language: "",
    serialNumber: "",
    triggerTables: [],
    triggerVenues: [],
    triggerLocations: [],
  };

  function handleSubmit(values: PrinterFormValues) {
    return create(values);
  }

  return { initialValues, handleSubmit };
}
