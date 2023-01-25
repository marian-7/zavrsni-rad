import React, { ChangeEvent, FC, memo, useCallback } from "react";
import { MenuItem } from "@material-ui/core";
import { Select } from "components/Select";

type Props = {
  color: "primary" | "secondary";
  currencies?: string[];
  className?: string;
  handleCurrencyChange: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
  value: string;
};

export const CurrencyPicker: FC<Props> = memo(function CurrencyPicker(props) {
  useCurrencyPicker();
  const { color, currencies, className, handleCurrencyChange, value } = props;

  const renderItem = useCallback((option: string) => {
    return (
      <MenuItem value={option} key={option}>
        {option}
      </MenuItem>
    );
  }, []);

  return (
    <Select color={color} value={value} onChange={handleCurrencyChange} className={className}>
      {currencies?.map(renderItem)}
    </Select>
  );
});

function useCurrencyPicker() {}
