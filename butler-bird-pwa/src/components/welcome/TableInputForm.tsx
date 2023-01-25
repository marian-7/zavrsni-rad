import React, { ChangeEvent, FC, memo, useCallback, useState } from "react";
import style from "styles/components/welcome/table-form-input.module.scss";
import { Button } from "components/Button";
import { useTranslation } from "next-i18next";
import { paths } from "paths";
import { useRouter } from "next/router";
import { Typography } from "@material-ui/core";
import { Input } from "components/Input";
import { Session } from "next-auth";
import queryString from "querystring";
import { useQuery } from "react-query";
import { getTableById } from "domain/services/tableService";
import { InvalidTable } from "components/welcome/InvalidTable";

type Props = {
  session: Session;
};

export const TableInputForm: FC<Props> = memo(function TableInputForm({ session }) {
  const {
    handleRedirectToQrPage,
    handleChange,
    isLoading,
    hideSnackbar,
    handleSubmit,
    tableId,
    showError,
  } = useTableInputForm(session);
  const { t } = useTranslation(["index", "common"]);

  return (
    <div className={style.form}>
      {!showError ? (
        <>
          <Button variant="contained" color="primary" onClick={handleRedirectToQrPage} fullWidth>
            {t("button.scanQr")}
          </Button>
          <Typography className={style.text}>{t("or")}</Typography>
          <Input
            name="tableId"
            className={style.input}
            color="secondary"
            label={t("placeholder.tableNumber")}
            onChange={handleChange}
            variant="standard"
            autoComplete="off"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            loading={isLoading}
            loadingText={t("loading", { ns: "common" })}
            disabled={tableId.length < 1 || isLoading}
          >
            {t("button.confirm", { ns: "common" })}
          </Button>
        </>
      ) : (
        <InvalidTable onClose={hideSnackbar} />
      )}
    </div>
  );
});

function useTableInputForm(session: Session) {
  const { push, query } = useRouter();
  const [tableId, setTableId] = useState("");
  const [showError, setShowError] = useState(query.error === "true");

  const handleRedirectToQrPage = useCallback(() => {
    return push(paths.qrInfo());
  }, [push]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTableId(e.target.value.trim());
  }, []);

  const { refetch, isLoading } = useQuery(
    ["table", tableId],
    ({ queryKey }) => {
      const [, id] = queryKey;
      if (id) {
        return getTableById(id)
          .then((res) => {
            setShowError(false);
            redirectToTable();
            return res.data;
          })
          .catch(() => {
            setShowError(true);
          });
      }
    },
    { enabled: false }
  );

  const hideSnackbar = useCallback(() => {
    setShowError(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const redirectToTable = useCallback(async () => {
    if (session) {
      push(paths.tables(tableId));
    } else {
      push(`${paths.login()}?${queryString.stringify({ tableId })}`);
    }
  }, [push, session, tableId]);

  return {
    handleRedirectToQrPage,
    handleChange,
    isLoading,
    showError,
    hideSnackbar,
    handleSubmit,
    tableId,
  };
}
