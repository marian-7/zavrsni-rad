import { ChangeEvent, FC, memo } from "react";
import { Option } from "util/types";
import { MenuItem, Select } from "@material-ui/core";
import { getFlag } from "domain/util/flag";
import style from "styles/components/LanguagePicker.module.scss";

type Props = {
  options: Option[];
  initial: string;
  onChange: (values: string) => void;
};

export const LanguagePicker: FC<Props> = memo(function LanguagePicker(props) {
  const { options, initial } = props;
  const { handleChange } = useLanguagePicker(props);

  const renderLanguage = (option: Option) => {
    return (
      <MenuItem key={option.value} value={option.value} className={style.item}>
        <img
          src={getFlag(option.value)}
          alt={`${option.value} flag`}
          className={style.flag}
        />
        {option.label}
      </MenuItem>
    );
  };

  return (
    <Select
      onChange={handleChange}
      value={initial}
      disableUnderline
      classes={{ root: style.root, icon: style.icon }}
      MenuProps={{
        classes: {
          list: style.list,
        },
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        getContentAnchorEl: null,
      }}
    >
      {options.map(renderLanguage)}
    </Select>
  );
});

function useLanguagePicker({ onChange }: Props) {
  function handleChange(e: ChangeEvent<{ value: unknown }>) {
    onChange(e.target.value as string);
  }

  return { handleChange };
}
