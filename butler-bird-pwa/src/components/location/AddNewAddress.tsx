import React, { ChangeEvent, FC, memo, useCallback, useState } from "react";
import { CircularProgress, InputAdornment, Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { QueryFunctionContext, useQuery } from "react-query";
import { throttle } from "lodash";
import { locationsService, SearchQuery } from "domain/services/locationsService";
import { Form, useFormikContext } from "formik";
import { SearchSuggestion } from "domain/types/Location";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import style from "styles/components/location/add-new-address.module.scss";
import { Button } from "components/Button";
import { AddressForm, AddressPayload } from "pages/tables/[id]/location/address";
import { AutocompleteResult } from "components/AutocompleteResult";
import { FormikInput } from "components/FormikInput";
import { NoAddress } from "components/location/NoAddress";
import { paths } from "paths";
import { Autocomplete, AutocompleteRenderInputParams } from "@material-ui/lab";
import { Input } from "components/Input";
import { useTable } from "hooks/useTable";
import { useRouter } from "hooks/useRouter";

type Props = {};

enum AutocompleteResultComponentType {
  Map = "map",
}

export const AddNewAddress: FC<Props> = memo(function AddNewAddress() {
  const {
    suggestions,
    suggestionsLoading,
    handleSearchChange,
    handleSuggestionClick,
    back,
    handleRedirect,
    isValid,
    filterOptions,
    getOptionLabel,
  } = useAddNewAddress();
  const { t } = useTranslation(["location", "common"]);

  const renderOption = useCallback(
    (option: SearchSuggestion) => {
      if (option.id === AutocompleteResultComponentType.Map) {
        return <NoAddress handleRedirect={handleRedirect} />;
      }
      return (
        <AutocompleteResult
          key={option.id}
          onSuggestionClick={handleSuggestionClick}
          option={option}
        />
      );
    },
    [handleRedirect, handleSuggestionClick]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<{}>, newValue: SearchSuggestion | string | null) => {
      if (newValue !== null && typeof newValue !== "string") {
        handleSuggestionClick(newValue);
      }
    },
    [handleSuggestionClick]
  );

  const AutocompleteInput = useCallback(
    (params: AutocompleteRenderInputParams) => {
      return (
        <Input
          {...params}
          label={t("label.streetAddressAndBuildingNumber")}
          onChange={handleSearchChange}
          className={style.input}
          InputLabelProps={{
            classes: {
              root: style.label,
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                <InputAdornment position="end">
                  {suggestionsLoading && <CircularProgress color="primary" size={18} />}
                </InputAdornment>
              </>
            ),
          }}
        />
      );
    },
    [handleSearchChange, suggestionsLoading, t]
  );

  const handleError = useCallback(() => {
    return <Typography>{t("form.error.suggestions")}</Typography>;
  }, [t]);

  return (
    <Form className={style.root}>
      <div className={style.container}>
        <div className={style.top}>
          <ButtonWithIcon startIcon={<ArrowBackIosIcon />} onClick={back}>
            {t("button.back", { ns: "common" })}
          </ButtonWithIcon>
          <Typography className={style.title}>{t("addNewAddress", { ns: "location" })}</Typography>
          <Typography className="mb-3">{t("startBySearch")}</Typography>
          <Autocomplete
            filterOptions={filterOptions}
            className={style.autocomplete}
            freeSolo
            clearOnEscape
            classes={{
              popper: style.popper,
              paper: style.paper,
              listbox: style.listbox,
              option: style.option,
            }}
            renderInput={AutocompleteInput}
            options={suggestions ?? []}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            onChange={handleChange}
            onError={handleError}
          />
          <FormikInput
            name="additionalInfo"
            label={t("label.staircaseApartmentFloor")}
            fullWidth
            className="mt-3"
          />
        </div>
        <div className={style.confirm}>
          <Button color="primary" variant="contained" type="submit" fullWidth disabled={!isValid}>
            {t("button.confirmAddress")}
          </Button>
        </div>
      </div>
    </Form>
  );
});

function useAddNewAddress() {
  const { setFieldValue, isValid } = useFormikContext<AddressForm>();
  const [search, setSearch] = useState("");
  const { push, back } = useRouter();
  const { table } = useTable();

  const filterOptions = useCallback((option) => option, []);

  const getOptionLabel = useCallback((option: SearchSuggestion) => {
    return option?.address?.label ?? "";
  }, []);

  const getSuggestions = async (params: QueryFunctionContext<[string, SearchQuery]>) => {
    try {
      const [, { query, at }] = params.queryKey;
      const res = await locationsService.suggestions({ query, at });
      //option for redirect
      res.data.items.push({
        id: AutocompleteResultComponentType.Map,
        title: "",
        position: { lat: 0, lng: 0 },
      });
      return res.data;
    } catch (error) {}
  };

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery(
    [
      "suggestions",
      {
        query: search,
        at: "0,0",
      },
    ],
    throttle(getSuggestions, 250),
    {
      enabled: search.length > 3,
    }
  );

  const handleSuggestionClick = useCallback(
    (option: SearchSuggestion) => {
      const address: AddressPayload = {
        streetAddress: option.title,
        hereId: option.id,
        position: { ...option.position },
      };
      setFieldValue("address", address);
    },
    [setFieldValue]
  );

  const handleRedirect = useCallback(async () => {
    if (table) {
      await push(paths.map(table.id), undefined, { preserveQuery: true });
    }
  }, [push, table]);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return {
    suggestionsLoading,
    handleSearchChange,
    handleSuggestionClick,
    back,
    handleRedirect,
    isValid,
    filterOptions,
    getOptionLabel,
    suggestions: suggestions?.items,
  };
}
