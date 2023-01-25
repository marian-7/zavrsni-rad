import React, { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Steps } from "components/NavigationDialog";
import { useTranslation } from "next-i18next";
import { Typography } from "@material-ui/core";
import { LanguagePicker } from "components/LanguagePicker";
import { CurrencyPicker } from "components/CurrencyPicker";
import style from "styles/components/settings.module.scss";
import { Button } from "components/Button";
import { Cookies, getCookieValueByOrganizationId, storePreferences } from "domain/util/cookies";
import { Dialog } from "components/Dialog";
import { useTable } from "hooks/useTable";
import { useRouter } from "next/router";
import { useCurrency } from "hooks/useCurrency";
import queryString from "querystring";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  path?: string;
};

export const Settings: FC<Props> = memo(function Settings(props) {
  const {
    handleCurrency,
    handleSave,
    localCurrency,
    handleLanguage,
    language,
    handleBack,
    languages,
    listOfCurrencies,
  } = useSettings(props);
  const { isOpen, onClose } = props;
  const { t } = useTranslation("common");

  return (
    <Dialog open={isOpen} onClose={onClose} onBack={handleBack} containerClassName={style.root}>
      <div className={style.settings}>
        <Typography className={style.label}>{t("navigation.chooseLanguage")}</Typography>
        {language && (
          <LanguagePicker
            className={style.languagePicker}
            color="primary"
            languages={languages}
            onChange={handleLanguage}
            value={language}
          />
        )}
        <Typography className={style.label}>{t("navigation.setCurrency")}</Typography>
        {localCurrency && (
          <CurrencyPicker
            className={style.currencyPicker}
            currencies={listOfCurrencies}
            color="primary"
            value={localCurrency}
            handleCurrencyChange={handleCurrency}
          />
        )}
        <Typography className={style.note}>{t("navigation.settingsNote")}</Typography>
      </div>

      <Button color="primary" variant="contained" className={style.button} onClick={handleSave}>
        {t("button.saveChanges")}
      </Button>
    </Dialog>
  );
});

function useSettings(props: Props) {
  const { path } = props;
  const { push, back, query } = useRouter();

  const { currency, onCurrencyChange } = useCurrency();

  const { table, currencies, listOfCurrencies, organizationId } = useTable();

  const languages = useMemo(() => {
    return table?.languages;
  }, [table?.languages]);

  const [localCurrency, setLocalCurrency] = useState<string>();
  const [language, setLanguage] = useState<string>();

  const handleBack = useCallback(() => {
    back();
  }, [back]);

  const handleCurrency = useCallback((e: ChangeEvent<{ name?: string; value: unknown }>) => {
    if (typeof e.target.value === "string") {
      setLocalCurrency(e.target.value);
    }
  }, []);

  const handleLanguage = useCallback((e: ChangeEvent<{ name?: string; value: unknown }>) => {
    if (typeof e.target.value === "string") {
      setLanguage(e.target.value);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (language && organizationId && localCurrency) {
      storePreferences(organizationId, Cookies.Language, language);
      storePreferences(organizationId, Cookies.Currency, localCurrency);
      onCurrencyChange(localCurrency);
      push(`${path}?${queryString.stringify({ modal: Steps.Initial })}`, undefined, {
        locale: language,
      });
    }
  }, [language, localCurrency, onCurrencyChange, organizationId, path, push]);

  const setInitialLanguage = useCallback(() => {
    if (organizationId) {
      const selectedOrganizationLanguage: string | undefined = getCookieValueByOrganizationId(
        organizationId,
        Cookies.Language
      );
      if (!selectedOrganizationLanguage) {
        setLanguage(languages?.[0]);
      } else {
        setLanguage(selectedOrganizationLanguage);
      }
    }
  }, [languages, organizationId]);

  const setInitialCurrency = useCallback(() => {
    if (currency) {
      setLocalCurrency(currency);
    }
  }, [currency]);

  useEffect(() => {
    setInitialLanguage();
    setInitialCurrency();
  }, [languages, organizationId, setInitialCurrency, setInitialLanguage]);

  useEffect(() => {
    if (query.modal !== Steps.Settings) {
      setInitialLanguage();
      setInitialCurrency();
    }
  }, [languages, organizationId, query.modal, setInitialCurrency, setInitialLanguage]);

  return {
    handleCurrency,
    handleSave,
    localCurrency,
    handleLanguage,
    language,
    handleBack,
    languages,
    currencies,
    listOfCurrencies,
  };
}
