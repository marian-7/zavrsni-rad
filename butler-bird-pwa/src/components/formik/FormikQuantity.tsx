import React, { FC, memo, useCallback } from "react";
import { useField } from "formik";
import { Quantity } from "components/item/Quantity";

type Props = {
  name?: string;
};

export const FormikQuantity: FC<Props> = memo(function FormikQuantity({ name = "quantity" }) {
  const { quantity, handleIncreaseQuantity, handleDecreaseQuantity } = useFormikQuantity(name);

  return (
    <Quantity
      quantity={quantity}
      onIncreaseQuantity={handleIncreaseQuantity}
      onDecreaseQuantity={handleDecreaseQuantity}
    />
  );
});

function useFormikQuantity(name: string) {
  const [, { value }, { setValue }] = useField(name);

  const handleIncreaseQuantity = useCallback(() => {
    setValue(value + 1);
  }, [setValue, value]);

  const handleDecreaseQuantity = useCallback(() => {
    setValue(value - 1);
  }, [setValue, value]);

  return { quantity: value, handleIncreaseQuantity, handleDecreaseQuantity };
}
