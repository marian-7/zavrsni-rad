import { ChangeEvent, FC, memo } from "react";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import style from "../styles/components/SimpleSelect.module.scss";

export interface Option {
  value: string;
  label: string;
}

type Props = {
  options: Option[];
  onChange: (value: string) => void;
  initialValue?: string;
  className?: string;
};

export const SimpleSelect: FC<Props> = memo(function SimpleSelect(props) {
  const { className, options, initialValue, ...rest } = props;
  const { handleChange } = useSimpleSelect(props);

  function renderOption(option: Option) {
    return (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    );
  }

  return (
    <FormControl className={className}>
      <Select
        {...rest}
        value={initialValue}
        onChange={handleChange}
        disableUnderline
        className={style.label}
        MenuProps={{ classes: { list: style.list } }}
      >
        {options.map(renderOption)}
      </Select>
    </FormControl>
  );
});

function useSimpleSelect({ onChange }: Props) {
  function handleChange(e: ChangeEvent<{ value: unknown }>) {
    onChange(e.target.value as string);
  }

  return { handleChange };
}
