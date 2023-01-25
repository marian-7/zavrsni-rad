import React, { FC, memo, useCallback, useRef, useState } from "react";
import { SidePage } from "components/SidePage";
import { useTranslation } from "react-i18next";
import { Table, Venue } from "domain/models/Venue";
import { TableListItem } from "pages/tables/components/TableListItem";
import { useOrganization } from "hooks/useOrganization";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { TableQr } from "pages/tables/components/TableQr";
import { useMutation, useQueryClient } from "react-query";
import { tablesService } from "domain/services/tablesService";
import { useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { includesEvery } from "util/array";
import { storageService } from "domain/services/storageService";
import printJS from "print-js";
import { useLocal } from "hooks/useLocal";
import { useFormikContext } from "formik";

interface Props {
  closePath: string;
  tables: Table[];
  onTablesChange: (tables: Table[]) => void;
}

export const TablesPage: FC<Props> = memo(function TablesPage(props) {
  const { closePath } = props;
  const {
    search,
    setSearch,
    filteredTables,
    handleRemoveClick,
    handleChange,
    setTable,
    table,
    handleQrClose,
    selectedTables,
    handleCheckboxClick,
    handleSelectAll,
    handleDeleteSelected,
    allTablesSelected,
    handlePdfDownloadClick,
    handlePdfPrintClick,
    values,
  } = useTablesPage(props);
  const { t } = useTranslation();

  function itemKey(index: number, { tables }: { tables: Table[] }) {
    return tables[index].id;
  }

  return (
    <>
      <SidePage
        title={t("pages.tables.title")}
        to={closePath}
        search={search}
        onSearchChange={setSearch}
        replaceList
        withActions
        withBulkDelete={!values.takeout}
        actionsEnabled={selectedTables.length > 0}
        onSelectAll={handleSelectAll}
        allItemsSelected={allTablesSelected}
        onPdfClick={handlePdfDownloadClick}
        onDeleteClick={handleDeleteSelected}
        onPrintClick={handlePdfPrintClick}
      >
        <div className="flex-1">
          <AutoSizer>
            {({ height, width }) => (
              <List
                itemKey={itemKey}
                itemData={{
                  venue: values,
                  tables: filteredTables,
                  selectedTables: selectedTables,
                  onRemoveClick: handleRemoveClick,
                  onChange: handleChange,
                  onQrClick: setTable,
                  onCheckboxClick: handleCheckboxClick,
                }}
                height={height}
                itemCount={filteredTables.length}
                itemSize={71}
                width={width}
              >
                {TableListItem}
              </List>
            )}
          </AutoSizer>
        </div>
      </SidePage>
      {table && <TableQr table={table} onClose={handleQrClose} />}
    </>
  );
});

function useTablesPage({ tables, onTablesChange }: Props) {
  const qc = useQueryClient();
  const params = useParams<{ venue?: string }>();
  const venue = params.venue ? toNumber(params.venue) : undefined;
  const organization = useOrganization();
  const [search, setSearch] = useState("");
  const [table, setTable] = useState<Table>();
  const removing = useRef<(number | string)[]>([]);
  const [selectedTables, setSelectedTables] = useState<Table[]>([]);
  const { local } = useLocal();
  const { values } = useFormikContext<Partial<Venue>>();

  const { mutateAsync: updateTable } = useMutation(tablesService.update, {
    onSuccess: ({ data }) => {
      if (venue) {
        qc.setQueryData<Venue | undefined>(["venues", venue], (old) => {
          if (!old) {
            return old;
          }
          return {
            ...old,
            tables: old.tables.map((table) => {
              return table.id === data.id ? data : table;
            }),
          };
        });
      }
      onTablesChange(tables.map((t) => (t.id === data.id ? data : t)));
    },
  });

  const { mutateAsync: removeTable } = useMutation(tablesService.remove, {
    onMutate: (id) => {
      removing.current = removing.current.concat([id]);
    },
    onSuccess: ({ data }) => {
      if (venue) {
        qc.setQueryData<Venue | undefined>(["venues", venue], (old) => {
          if (!old) {
            return old;
          }
          const tables = old.tables.filter((table) => table.id !== data.id);
          return {
            ...old,
            tables,
          };
        });
      }
      onTablesChange(tables.filter((t) => !removing.current.includes(t.id)));
    },
  });

  const filteredTables = tables.filter((table) =>
    table.label.toLowerCase().includes(search.toLowerCase())
  );

  function handleRemoveClick(table: Table) {
    setSelectedTables((prevState) =>
      prevState.filter((t) => t.id !== table.id)
    );
    return removeTable(table.id).then(
      () => {},
      () => {}
    );
  }

  function handleDeleteSelected() {
    return selectedTables.map((table) =>
      removeTable(table.id).then(
        () => {
          setSelectedTables((prevState) =>
            prevState.filter((t) => t.id !== table.id)
          );
        },
        () => {}
      )
    );
  }

  function handleChange(table: Table) {
    return updateTable(table).then(
      () => {},
      () => {}
    );
  }

  function handleQrClose() {
    setTable(undefined);
  }

  function handleCheckboxClick(table: Table) {
    setSelectedTables((prevState) => {
      const isChecked = prevState.includes(table);
      if (!isChecked) {
        return prevState.concat([table]);
      }
      return prevState.filter((t) => t.id !== table.id);
    });
  }

  const allTablesSelected =
    selectedTables.length === tables.length && selectedTables.length > 0;

  const handleSelectAll = useCallback(() => {
    setSelectedTables((prevState) =>
      includesEvery(prevState, tables) && prevState.length === tables.length
        ? []
        : tables
    );
  }, [tables]);

  async function getPdf() {
    const query = selectedTables.map((t) => `id_in=${t.id}`).join("&");
    let url = `${process.env.REACT_APP_BASE_API_URL}/qr?${query}`;

    let headers = new Headers();
    headers.append(
      "authorization",
      `Bearer ${storageService.getAccessToken(organization!?.slug)}`
    );
    headers.append("organization", organization!?.id.toString());
    headers.append("locale", local);

    return fetch(url, { headers }).then((response) => response.blob());
  }

  async function handlePdfDownloadClick() {
    const blob = await getPdf();

    let objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "tables.pdf";
    anchor.click();
    window.URL.revokeObjectURL(objectUrl);
    anchor.remove();
  }

  async function handlePdfPrintClick() {
    const blob = await getPdf();
    let objectUrl = window.URL.createObjectURL(blob);

    printJS(objectUrl, "pdf");
    window.URL.revokeObjectURL(objectUrl);
  }

  return {
    search,
    setSearch,
    filteredTables,
    organization,
    handleRemoveClick,
    handleChange,
    setTable,
    table,
    handleQrClose,
    selectedTables,
    handleCheckboxClick,
    handleSelectAll,
    handleDeleteSelected,
    allTablesSelected,
    handlePdfDownloadClick,
    handlePdfPrintClick,
    values,
  };
}
