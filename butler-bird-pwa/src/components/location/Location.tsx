import React, { FC, memo, useCallback } from "react";
import { Typography, ButtonBase } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import style from "styles/components/location/location.module.scss";
import { UserAddress } from "domain/types/Location";

type Props = {
  location: UserAddress;
  handleAddress: (addressId: number) => void;
};

export const Location: FC<Props> = memo(function Location({ location, handleAddress }) {
  const { streetAddress, city, id } = location;
  const { showAddressDetails } = useLocation(handleAddress, id);

  return (
    <ButtonBase className={style.location} onClick={showAddressDetails}>
      <Typography className={style.text}>{streetAddress}</Typography>
      <div className={style.bottom}>
        <Typography>{city}</Typography>
        <ArrowForwardIosIcon className={style.icon} />
      </div>
    </ButtonBase>
  );
});

function useLocation(handleAddress: (addressId: number) => void, id: number) {
  const showAddressDetails = useCallback(() => {
    handleAddress(id);
  }, [handleAddress, id]);

  return { showAddressDetails };
}
