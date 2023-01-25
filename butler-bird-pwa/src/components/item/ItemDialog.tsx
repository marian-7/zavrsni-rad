import React, { FC, memo, useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { keyBy } from "lodash";
import { Dialog } from "components/Dialog";
import { useMenu } from "hooks/useMenu";
import { Formik } from "formik";
import { useOrder } from "hooks/useOrder";
import { getValidationErrors, itemSchema } from "domain/util/validation";
import { OptionPickerForm } from "components/item/OptionPickerForm";
import { getItemPrice } from "domain/util/price";
import { MenuModal } from "providers/MenuProvider";
import { useRouter } from "next/router";
import style from "styles/components/item/item-dialog.module.scss";
import { Option } from "domain/types/Option";

type Props = {};

export type ItemOptions = {
  quantity: number;
  groups: Record<number, MultipleOptionGroupOptions[] | number>;
};

export type MultipleOptionGroupOptions = {
  [option: number]: number;
};

export const ItemDialog: FC<Props> = memo(function ItemDialog() {
  const { item, handleSubmit, initialValues, validate, modalType, handleClose } = useItemDialog();
  const { t } = useTranslation(["menu", "common"]);

  return (
    <Dialog
      open={!!item && modalType === MenuModal.Item}
      onBack={handleClose}
      backText={t("button.back", { ns: "common" })}
      noPadding
      topClassName={style.dialog}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={validate}
        validateOnMount
      >
        <OptionPickerForm />
      </Formik>
    </Dialog>
  );
});

function useItemDialog() {
  const { item, onClose, modalType } = useMenu();
  const { back, query } = useRouter();

  const { addItem } = useOrder();

  const initialValues = useMemo<ItemOptions>(() => {
    const groups = item?.optionGroups?.reduce<
      Record<number, number | MultipleOptionGroupOptions[]>
    >((res, group) => {
      if (group.selectionMode === "single" && group.required) {
        res[group.id] = group.options[0].id;
      } else if (group.selectionMode === "single" && !group.required) {
        res[group.id] = 0;
      } else {
        res[group.id] = group.options.map((option) => {
          return { [option.id]: 0 };
        });
      }
      return res;
    }, {});
    return {
      quantity: 1,
      groups: groups ?? {},
    };
  }, [item?.optionGroups]);

  const validate = useCallback(
    (values: ItemOptions) => {
      return getValidationErrors(itemSchema, values, {
        context: item,
        strict: false,
      });
    },
    [item]
  );

  const handleOptionGroups = useCallback(
    (values: ItemOptions) => {
      const { groups } = values;
      if (!item) {
        return;
      }
      const groupRecord = keyBy(item.optionGroups, "id");
      const optionGroups = Object.entries(groups)
        .map(([key, values]) => {
          const group = groupRecord[key];
          const optionRecord = keyBy(group.options, "id");
          let options = [];
          if (Array.isArray(values)) {
            options = values
              .reduce<Option[][]>((res, option) => {
                const entries = Object.entries(option);
                const selectedOptions = entries.map(([key, value]) => {
                  return { ...optionRecord[key], amount: value };
                });
                res.push(selectedOptions.filter((option) => option.amount));
                return res;
              }, [])
              .flat();
          } else {
            if (values !== 0) {
              options.push(optionRecord[values]);
            }
          }

          return { ...group, options };
        })
        .filter((optionGroup) => optionGroup.options.length > 0);
      return { ...item, optionGroups };
    },
    [item]
  );

  const handleSubmit = useCallback(
    (values: ItemOptions) => {
      const { quantity } = values;
      const orderItem = handleOptionGroups(values);
      const { menu } = query;

      if (orderItem && menu && !Array.isArray(menu)) {
        const price = getItemPrice(orderItem, quantity);
        addItem(orderItem, quantity, price, parseInt(menu, 10));
        onClose();
      }
    },
    [addItem, handleOptionGroups, onClose, query]
  );

  const handleClose = useCallback(() => {
    back();
  }, [back]);

  return { item, onClose, handleSubmit, initialValues, validate, modalType, handleClose };
}
