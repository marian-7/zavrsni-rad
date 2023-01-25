import React, { FC, memo, useState } from "react";
import { SettingsCurrencyHeader } from "pages/settingsCurrency/components/SettingsCurrencyHeader";
import singlePageStyle from "styles/components/SinglePage.module.scss";
import { Typography } from "@material-ui/core";
import style from "styles/pages/settingsCurrency/SettingsCurrencyPage.module.scss";
import { useOrganization } from "hooks/useOrganization";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import { Input } from "components/Input";
import { ReactComponent as EastIcon } from "assets/icons/east.svg";
import { SimpleSelect } from "components/SimpleSelect";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { currenciesService } from "domain/services/currenciesService";
import { mapData } from "domain/util/axios";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

interface Props {}

export const SettingsCurrencyPage: FC<Props> = memo(
  function SettingsCurrencyPage() {
    const {
      organization,
      currencies,
      setCurrency,
      currencyValue,
      baseValue,
      convertedValue,
      handleBaseValueChange,
    } = useSettingsCurrencyPage();
    const { t } = useTranslation();

    return (
      <OverlayScrollbarsComponent
        className={singlePageStyle.container}
        options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
      >
        <div className={singlePageStyle.form}>
          <SettingsCurrencyHeader />
          <div className={singlePageStyle.body}>
            <Typography className={style.label}>
              {t("pages.settingsCurrency.label")}
            </Typography>
            <Typography className={style.text}>
              {t("pages.settingsCurrency.note")}
            </Typography>
            {organization && currencies.length > 0 && (
              <div className={style.converter}>
                <NumberFormat
                  customInput={Input}
                  value={baseValue}
                  onValueChange={handleBaseValueChange}
                  allowNegative={false}
                  className={style.input}
                  decimalScale={2}
                  fixedDecimalScale
                />
                <Typography className={style.label}>
                  {organization.currency}
                </Typography>
                <EastIcon className={style.convertIcon} />
                <Typography className={style.convertedValue}>
                  {convertedValue?.toFixed(2)}
                </Typography>
                <SimpleSelect
                  options={currencies}
                  initialValue={currencyValue}
                  onChange={setCurrency}
                />
              </div>
            )}
          </div>
        </div>
      </OverlayScrollbarsComponent>
    );
  }
);

function useSettingsCurrencyPage() {
  const organization = useOrganization();
  const { data } = useQuery(
    ["exchange", organization?.currency],
    ({ queryKey }) => {
      const [, iso] = queryKey;
      return currenciesService.exchange(iso!).then(mapData);
    },
    { enabled: !!organization?.currency }
  );
  const [currency, setCurrency] = useState<string>();
  const [baseValue, setBaseValue] = useState(1);

  const currencies = Object.keys(data ?? {})
    .map((value) => ({
      value,
      label: value,
    }))
    .filter((option) => option.value !== organization?.currency);

  const currencyValue = currency ?? currencies[0]?.value ?? "";
  const rate = data?.[currencyValue];
  const convertedValue = rate ? baseValue * rate : undefined;

  function handleBaseValueChange(values: NumberFormatValues) {
    setBaseValue(values.floatValue ?? 1);
  }

  return {
    organization,
    currencies,
    setCurrency,
    currencyValue,
    convertedValue,
    baseValue,
    handleBaseValueChange,
  };
}
