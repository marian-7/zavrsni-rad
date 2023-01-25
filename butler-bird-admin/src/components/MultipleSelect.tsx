import { FormControl, Input, MenuItem, ListItemText } from "@material-ui/core";
import Select, { SelectProps } from "@material-ui/core/Select";
import React, { FC, memo } from "react";
import { ChangeEvent } from "react";
import select from "styles/components/Select.module.scss";
import { keyBy } from "lodash";
import classNames from "classnames";
import { Checkbox } from "components/Checkbox";
import { Option } from "util/types";

type Props = Omit<SelectProps, "onChange"> & {
  options: Option[];
  value: number[];
  onChange: (value: number[]) => void;
};

export const MultipleSelect: FC<Props> = memo(function MultipleSelect(props) {
  const { options, value, placeholder, className, ...rest } = props;
  const { handleChange, record } = useMultipleSelect(props);

  function renderOption(option: Option) {
    return (
      <MenuItem
        key={option.value}
        value={option.value}
        className={select.menuItem}
      >
        <Checkbox checked={value.includes(option.value)} />
        <ListItemText primary={option.label} />
      </MenuItem>
    );
  }

  function renderValue(selected: unknown) {
    if ((selected as number[]).length === 0) {
      return placeholder ?? null;
    }
    return (selected as number[])
      .map((option) => record[option].label)
      .join(", ");
  }

  return (
    <FormControl className={classNames(select.container, className)}>
      <Select
        {...rest}
        placeholder={placeholder}
        classes={{ root: select.root, icon: select.icon }}
        multiple
        displayEmpty
        value={value}
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
    </FormControl>
  );
});

function useMultipleSelect({ onChange, options }: Props) {
  const record = keyBy(options, "value");

  function handleChange(e: ChangeEvent<{ value: unknown }>) {
    onChange(e.target.value as number[]);
  }

  return { handleChange, record };
}
