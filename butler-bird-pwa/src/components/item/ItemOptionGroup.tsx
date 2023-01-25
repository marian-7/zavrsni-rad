import React, { FC, memo, useCallback } from "react";
import style from "styles/components/item/option-picker-form.module.scss";
import { Typography } from "@material-ui/core";
import { OptionGroup } from "domain/types/OptionGroup";
import { useRouter } from "next/router";
import { Option } from "domain/types/Option";
import { RadioItem } from "./RadioItem";
import { FormikRadioGroup } from "components/formik/FormikRadioGroup";
import { CheckboxItem } from "./CheckboxItem";
import { FormikCheckboxGroup } from "components/formik/FormikCheckboxGroup";
import { Radio } from "components/Radio";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import { useTable } from "hooks/useTable";
import { OrganizationMode } from "domain/types/Organization";
import { getLabel } from "domain/util/text";

type Props = {
  optionGroup: OptionGroup;
};

export const ItemOptionGroup: FC<Props> = memo(function OptionGroup({ optionGroup }) {
  const { name, selectionMode, options, required, description } = optionGroup;
  const { locale } = useRouter();
  const { t } = useTranslation("menu");
  const { table } = useOptionGroup();

  const renderRadio = useCallback(
    (option: Option) => {
      return (
        <RadioItem
          key={option.id}
          option={option}
          showControl={table?.mode !== OrganizationMode.View}
        />
      );
    },
    [table?.mode]
  );

  const renderCheckbox = useCallback(
    (option: Option, index: number) => {
      return (
        <CheckboxItem
          key={option.id}
          option={option}
          groupName={`groups.${optionGroup.id}`}
          index={index}
          groupId={optionGroup.id}
          quantityClassName={style.quantity}
          showControl={table?.mode !== OrganizationMode.View}
        />
      );
    },
    [optionGroup.id, table?.mode]
  );

  return (
    <div className={style.optionGroup}>
      <Typography className={style.optionGroupText}>
        {name[locale!]}
        {required && selectionMode === "multiple" && (
          <>
            <Typography component="span" className={style.required} color="primary">
              {t("required")}
            </Typography>
          </>
        )}
      </Typography>
      {description && <Typography className="mb-2">{getLabel(description, locale!)}</Typography>}
      {selectionMode === "single" ? (
        <FormikRadioGroup
          name={`groups.${optionGroup.id}`}
          className={classNames(style.bg, style.radioOptions)}
        >
          {options.map(renderRadio)}
          {!required && table && table.mode !== OrganizationMode.View && (
            <Radio label={t("option.nothing")} value={0} radioClassName={style.radio} />
          )}
        </FormikRadioGroup>
      ) : (
        <FormikCheckboxGroup
          name={`groups.${optionGroup.id}`}
          className={classNames(style.bg, style.checkboxOptions)}
        >
          {options.map(renderCheckbox)}
        </FormikCheckboxGroup>
      )}
    </div>
  );
});

function useOptionGroup() {
  const { table } = useTable();

  return { table };
}
