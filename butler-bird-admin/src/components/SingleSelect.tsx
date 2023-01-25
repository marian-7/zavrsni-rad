import {
  FormControl,
  Input,
  MenuItem,
  ListItemText,
  InputLabel,
  FormHelperText,
  Icon,
} from "@material-ui/core";
import Select, { SelectProps } from "@material-ui/core/Select";
import React, { FC, memo } from "react";
import { ChangeEvent } from "react";
import select from "styles/components/Select.module.scss";
import { get, keyBy } from "lodash";
import classNames from "classnames";
import { Radio } from "components/Radio";
import { Option } from "util/types";
import inputStyle from "styles/components/Input.module.scss";
import style from "styles/components/Input.module.scss";
import { ReactComponent as WarningIcon } from "assets/icons/warning.svg";

export type SingleSelectProps = Omit<SelectProps, "onChange"> & {
  options: Option[];
  value?: any;
  onChange?: (value: any) => void;
  withRadioInput?: boolean;
  withHelperText?: boolean;
  errorMessage?: string;
  errorIcon?: boolean;
};

export const SingleSelect: FC<SingleSelectProps> = memo(function SingleSelect(
  props
) {
  const {
    options,
    value,
    placeholder,
    className,
    label,
    errorMessage,
    withRadioInput = true,
    withHelperText = false,
    errorIcon = true,
    ...rest
  } = props;
  const { handleChange, record } = useSingleSelect(props);

  function renderOption(option: Option) {
    return (
      <MenuItem
        key={option.value}
        value={option.value}
        className={classNames(select.menuItem, {
          [select.menuItemTextOnly]: !withRadioInput,
        })}
      >
        {withRadioInput && <Radio checked={value === option.value} />}
        <ListItemText primary={option.label} />
      </MenuItem>
    );
  }

  function renderValue(selected: unknown) {
    return get(record, [selected as any, "label"], placeholder ?? "");
  }

  return (
    <FormControl
      className={classNames(select.container, className, {
        [select.withHelperText]: withHelperText,
      })}
    >
      {label && (
        <InputLabel shrink className={inputStyle.label} htmlFor={props.name}>
          {label}
        </InputLabel>
      )}
      <Select
        {...rest}
        placeholder={placeholder}
        classes={{ root: select.root, icon: select.icon }}
        multiple={false}
        displayEmpty
        value={value ?? ""}
        input={<Input disableUnderline />}
        renderValue={renderValue}
        onChange={handleChange}
        MenuProps={{
          className: select.menu,
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          getContentAnchorEl: null,
        }}
      >
        {options.map(renderOption)}
      </Select>
      {withHelperText && (
        <FormHelperText
          hidden={!errorMessage}
          error={!!errorMessage}
          className={style.helperText}
        >
          {errorMessage}
          {errorMessage && errorIcon && (
            <Icon
              component={WarningIcon}
              className={classNames("MuiSvgIcon-error", style.errorIcon)}
            />
          )}
        </FormHelperText>
      )}
    </FormControl>
  );
});

function useSingleSelect({ onChange, options }: SingleSelectProps) {
  const record = keyBy(options, "value");

  function handleChange(e: ChangeEvent<{ value: unknown }>) {
    onChange?.(e.target.value as any);
  }

  return { handleChange, record };
}
