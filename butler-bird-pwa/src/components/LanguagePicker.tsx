import React, { ChangeEvent, FC, memo, useCallback, useState } from "react";
import { Select } from "components/Select";
import { MenuItem } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import { getFlag } from "domain/util/flag";
import style from "styles/components/language-picker.module.scss";

type Props = {
  color: "primary" | "secondary";
  className?: string;
  languages?: string[];
  value: string;
  onChange: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
};

export const LanguagePicker: FC<Props> = memo(function LanguagePicker({
  color,
  className,
  languages,
  value,
  onChange,
}) {
  useLanguagePicker();
  const { t } = useTranslation("languages");

  const renderItem = useCallback(
    (option: string) => {
      return (
        <MenuItem value={option} key={option} className={style.menuItem}>
          <img src={getFlag(option)} className={style.flag} />
          {t(option)}
        </MenuItem>
      );
    },
    [t]
  );

  return (
    <Select color={color} value={value} onChange={onChange} className={className}>
      {languages?.map(renderItem)}
    </Select>
  );
});

function useLanguagePicker() {
  const [value, setValue] = useState<string>("1");
  const handleChange = useCallback((e: ChangeEvent<{ name?: string; value: unknown }>) => {
    setValue(e.target.value as string);
  }, []);

  return { value, handleChange };
}
