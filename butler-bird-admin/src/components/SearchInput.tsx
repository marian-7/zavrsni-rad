import React, { FC, memo } from "react";
import { InputAdornment } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import { Input, InputProps } from "components/Input";
import { useTranslation } from "react-i18next";
import style from "styles/components/SearchInput.module.scss";

type Props = InputProps & {};

export const SearchInput: FC<Props> = memo(function SearchInput(props) {
  useSearchInput();
  const { t } = useTranslation();

  return (
    <Input
      name="search"
      withHelperText={false}
      placeholder={t("form.placeholders.search")}
      endAdornment={
        <InputAdornment position="end">
          <SearchIcon className={style.icon} />
        </InputAdornment>
      }
      {...props}
    />
  );
});

function useSearchInput() {}
