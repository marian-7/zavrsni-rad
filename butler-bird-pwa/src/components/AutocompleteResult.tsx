import React, { FC, memo, useCallback } from "react";
import { SearchSuggestion } from "domain/types/Location";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import style from "styles/components/autocomplete-result.module.scss";

type Props = {
  onSuggestionClick: (option: SearchSuggestion) => void;
  option: SearchSuggestion;
};

export const AutocompleteResult: FC<Props> = memo(function AutocompleteResult(props) {
  const { handleClick } = useAutocompleteResult(props);
  const { t } = useTranslation("location");
  const { option } = props;

  return (
    <div className={style.root} onClick={handleClick}>
      <Typography className={style.label}>{option.address?.label}</Typography>
      <div className={style.bottom}>
        <Typography>{t("searchResult.userLocation")}</Typography>
        <ArrowForwardIosIcon className={style.icon} />
      </div>
    </div>
  );
});

function useAutocompleteResult(props: Props) {
  const { option, onSuggestionClick } = props;

  const handleClick = useCallback(() => {
    onSuggestionClick(option);
  }, [onSuggestionClick, option]);

  return { handleClick };
}
