import { FC, memo, useMemo } from "react";
import style from "styles/pages/order/components/OrderItem.module.scss";
import { OptionGroup } from "domain/models/Order";
import { Typography } from "@material-ui/core";
import { useLocal } from "hooks/useLocal";
import { getFormattedPrice } from "domain/util/price";
import { Separator } from "components/Separator";
import { getLabel } from "domain/util/text";
import { ItemsSnapshot } from "domain/models/Order";
import classNames from "classnames";
import { Option } from "../../../domain/models/OptionGroup";

type Props = {
  item: ItemsSnapshot;
  currency: string;
  containerClassName?: string;
};

export const OrderItem: FC<Props> = memo(function OrderItem(props) {
  const { item, currency, containerClassName } = props;
  const { local, totalPrice } = useOrderItem(props);

  const itemAmount = item?.amount ?? 1;

  function renderOption(option: Option) {
    const optionAmount = option.amount ?? 1;

    return (
      <div key={option.id} className={style.option}>
        <Separator mh={8} size={6} />
        <Typography className={style.optionLabel}>
          {optionAmount}x {getLabel(option.name, local)}
        </Typography>
        <Typography className={style.price}>
          {`${getFormattedPrice(
            option.price * optionAmount * itemAmount,
            local,
            currency
          )}`}
        </Typography>
      </div>
    );
  }

  function renderOptionGroup(optionGroup: OptionGroup) {
    return optionGroup.options?.map(renderOption);
  }

  return (
    <div className={classNames(style.container, containerClassName)}>
      <div className="d-flex">
        <Typography className={style.amount}>{`${itemAmount}x`}</Typography>
        <Typography className={style.name}>
          {getLabel(item.name, local)}
        </Typography>
        <Typography className={style.price}>{totalPrice}</Typography>
      </div>
      {item.optionGroups?.map(renderOptionGroup)}
    </div>
  );
});

function useOrderItem({ item, currency }: Props) {
  const { local } = useLocal();

  const totalPrice = useMemo(() => {
    const totalAmount = item.price * (item?.amount ?? 1);
    return getFormattedPrice(totalAmount, local, currency);
  }, [currency, item?.amount, item.price, local]);

  return { local, totalPrice };
}
