import React, { FC, memo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  printersService,
  UpdatePrinterData,
} from "domain/services/printersService";
import { mapData } from "domain/util/axios";
import { Printer } from "domain/models/Printer";
import { toNumber } from "lodash";
import { Formik } from "formik";
import { PrinterForm, PrinterFormValues } from "components/printer/PrinterForm";
import { printerSchema } from "domain/util/validators";
import { paths, withSlug } from "paths";

interface Props {}

export const PrinterPage: FC<Props> = memo(function PrinterPage() {
  const {
    initialValues,
    handleSubmit,
    handleDelete,
    isDeleting,
  } = usePrinterPage();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={printerSchema}
    >
      <PrinterForm
        create={false}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </Formik>
  );
});

function usePrinterPage() {
  const qc = useQueryClient();
  const params = useParams<{ printer: string }>();
  const id = toNumber(params.printer);
  const { replace } = useHistory();
  const { mutateAsync: update } = useMutation<
    Printer,
    unknown,
    UpdatePrinterData
  >((data) => printersService.update(data).then(mapData), {
    onSuccess: (data) => {
      qc.setQueryData<Printer>(["printers", data.id], data);
      qc.setQueryData<Printer[]>(
        "printers",
        (old) => old?.map((p) => (p.id === data.id ? data : p)) ?? []
      );
    },
  });
  const { mutateAsync: remove, isLoading: isDeleting } = useMutation<
    unknown,
    unknown,
    number
  >((id) => printersService.remove(id).then(mapData), {
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["printers", id] });
      qc.setQueryData<Printer[]>(
        "printers",
        (old) => old?.filter((p) => p.id !== id) ?? []
      );
      replace(withSlug(paths.printers()));
    },
  });

  const { data } = useQuery(
    ["printers", id],
    ({ queryKey }) => {
      const [, id] = queryKey;
      return printersService.getOne(id).then(mapData);
    },
    {
      placeholderData: () =>
        qc
          .getQueryData<Printer[]>("printers")
          ?.find((printer) => printer.id === id),
    }
  );

  const initialValues: PrinterFormValues = {
    name: data?.name ?? "",
    serialNumber: data?.serialNumber ?? "",
    language: data?.language ?? "",
    triggerLocations: data?.triggerLocations ?? [],
    triggerVenues: data?.triggerVenues ?? [],
    triggerTables: data?.triggerTables ?? [],
  };

  function handleSubmit(values: PrinterFormValues) {
    return update({ id, ...values });
  }

  function handleDelete() {
    return remove(id);
  }

  return { initialValues, handleSubmit, handleDelete, isDeleting };
}
