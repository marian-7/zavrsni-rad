import React, { FC, memo, useCallback } from "react";
import { Option } from "domain/types/Option";
import { Label } from "components/Label";
import { useRouter } from "next/router";
import { Checkbox } from "components/Checkbox";
import { getLabel } from "domain/util/text";
import { useModifierLabel } from "hooks/useModifierLabel";
import { Quantity } from "components/item/Quantity";
import { useFormikContext } from "formik";
import { ItemOptions, MultipleOptionGroupOptions } from "components/item/ItemDialog";
import { Description } from "./Description";
import { ViewOnlyItem } from "./ViewOnlyItem";

type Props = {
  option: Option;
  groupName: string;
  index: number;
  groupId: number;
  quantityClassName?: string;
  showControl: boolean;
};

export const CheckboxItem: FC<Props> = memo(function CheckboxItem({
  option,
  groupName,
  index,
  groupId,
  quantityClassName,
  showControl,
}) {
  const { id, price, name, description } = option;
  const { quantity, handleDecreaseQuantity, handleIncreaseQuantity } = useCheckboxItem(
    groupId,
    id,
    index
  );
  const { locale } = useRouter();
  const formattedPrice = useModifierLabel(price);

  return (
    <>
      {showControl ? (
        <div>
          <Checkbox
            name={groupName}
            value={id}
            index={index}
            label={<Label text={getLabel(name, locale!)} price={formattedPrice} />}
          />
          {description && <Description text={getLabel(description, locale!)} />}
          {quantity > 0 && (
            <Quantity
              quantity={quantity}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              className={quantityClassName}
            />
          )}
        </div>
      ) : (
        <ViewOnlyItem option={option} formattedPrice={formattedPrice} />
      )}
    </>
  );
});

function useCheckboxItem(groupId: number, id: number, index: number) {
  const { setFieldValue, values } = useFormikContext<ItemOptions>();

  const quantity = (() => {
    return (values.groups[groupId] as MultipleOptionGroupOptions[])[index][id];
  })();

  const handleIncreaseQuantity = useCallback(() => {
    setFieldValue(`groups.${groupId}.${index}.${id}`, quantity + 1);
  }, [groupId, id, index, quantity, setFieldValue]);

  const handleDecreaseQuantity = useCallback(() => {
    setFieldValue(`groups.${groupId}.${index}.${id}`, quantity - 1);
  }, [groupId, id, index, quantity, setFieldValue]);

  return { quantity, handleDecreaseQuantity, handleIncreaseQuantity };
}
