import React, { FC, memo } from "react";
import { Typography } from "@material-ui/core";
import style from "styles/components/location/address.module.scss";
import { AddressPayload } from "pages/tables/[id]/location/address";

type Props = {
  location: AddressPayload;
};

export const Address: FC<Props> = memo(function Address({ location }) {
  useAddress();
  const { streetAddress, additionalInfo } = location;

  return (
    <div className={style.root}>
      <Typography className={style.address}>{streetAddress}</Typography>
      {additionalInfo && <Typography className="mt-1">{additionalInfo}</Typography>}
      <Typography />
    </div>
  );
});

function useAddress() {}
