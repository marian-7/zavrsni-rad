import React, { ChangeEvent, FC, memo, useCallback, useState } from "react";
import { Select as MuiSelect, SelectProps } from "@material-ui/core";
import style from "styles/components/select.module.scss";
import { FormHelperText } from "@material-ui/core";
import { Typography } from "@material-ui/core";

type Props = SelectProps & {
  errorMessage?: string;
  value: string;
  onChange?: (event: ChangeEvent<{ name?: string; value: unknown }>) => void;
};

const light = "#ffffff";
const dark = "#404259";

export const Select: FC<Props> = memo(function Select(props) {
  const { selectedValue, handleSelect } = useSelect(props);
  const { errorMessage, value, color, children, ...rest } = props;

  return (
    <>
      <MuiSelect
        {...rest}
        style={{ color: color === "primary" ? dark : light }}
        classes={{ root: style.root, select: style.select, icon: style.icon }}
        disableUnderline
        onChange={handleSelect}
        variant="standard"
        value={selectedValue ?? value}
        displayEmpty
        error={!!errorMessage}
        renderValue={value !== "" ? undefined : () => <Typography>{props.placeholder}</Typography>}
      >
        {children}
      </MuiSelect>
      {errorMessage && <FormHelperText className={style.helperText}>{errorMessage}</FormHelperText>}
    </>
  );
});

function useSelect(props: Props) {
  const { onChange } = props;
  const [selectedValue, setSelectedValue] = useState<string>();

  const handleSelect = useCallback(
    (e: ChangeEvent<{ name?: string; value: unknown }>) => {
      onChange?.(e);
      if (typeof e.target.value === "string") {
        setSelectedValue(e.target.value);
      }
    },
    [onChange]
  );

  return { handleSelect, selectedValue };
}
