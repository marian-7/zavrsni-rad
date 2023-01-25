import React, { FC, memo, useCallback } from "react";
import { ButtonBase, Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import style from "styles/components/table/staff.module.scss";
import { useRouter } from "next/router";
import { OrderType } from "domain/types/OrderType";
import { getLabel } from "domain/util/text";
import { useTable } from "hooks/useTable";

type Props = {
  customOrder: OrderType;
  onClick: (tableId: string | number, type: number) => void;
};

export const StaffOptions: FC<Props> = memo(function StaffOptions(props) {
  const { customOrder } = props;
  const { handleCallStaff } = useStaffOptions(props);
  const { name } = customOrder;
  const { locale } = useRouter();

  return (
    <ButtonBase className={style.root} onClick={handleCallStaff}>
      <Typography className={style.text}>{getLabel(name, locale!)}</Typography>
      <ArrowForwardIosIcon className={style.icon} />
    </ButtonBase>
  );
});

function useStaffOptions(props: Props) {
  const { onClick, customOrder } = props;
  const { table } = useTable();

  const handleCallStaff = useCallback(() => {
    if (table) {
      onClick(table.id, customOrder.id);
    }
  }, [customOrder.id, onClick, table]);

  return { handleCallStaff };
}
