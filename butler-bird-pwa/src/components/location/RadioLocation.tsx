import React, { FC, memo, useCallback } from "react";
import { Radio } from "components/Radio";
import { Typography } from "@material-ui/core";
import style from "styles/components/location/radio-location.module.scss";
import { UserAddress } from "domain/types/Location";
import EditIcon from "@material-ui/icons/Edit";
import { paths } from "paths";
import { IconButton } from "@material-ui/core";
import { useTable } from "hooks/useTable";
import * as querystring from "querystring";
import { useRouter } from "hooks/useRouter";

type Props = {
  location: UserAddress;
};

export const RadioLocation: FC<Props> = memo(function Location({ location }) {
  const { city, streetAddress, id } = location;
  const { handleClick } = useLocation(id);

  return (
    <div>
      <div className="d-flex justify-content-space-between align-items-center">
        <Radio
          value={id}
          className={style.location}
          radioClassName={style.radio}
          label={<Typography className={style.label}>{streetAddress}</Typography>}
        />
        <IconButton children={<EditIcon />} onClick={handleClick} className={style.editBtn} />
      </div>
      {city && <Typography className={style.description}>{city}</Typography>}
    </div>
  );
});

function useLocation(id: number) {
  const { push } = useRouter();
  const { table } = useTable();

  const handleClick = useCallback(async () => {
    if (table) {
      await push(`${paths.addressDetails(table.id)}?${querystring.stringify({ locationId: id })}`);
    }
  }, [id, push, table]);

  return { handleClick };
}
