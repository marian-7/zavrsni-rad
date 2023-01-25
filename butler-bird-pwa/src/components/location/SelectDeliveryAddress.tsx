import React, { FC, memo, useCallback, useState } from "react";
import { Map } from "components/location/Map";
import { Typography } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { useTranslation } from "next-i18next";
import { Button } from "components/Button";
import style from "styles/components/location/select-delivery-address.module.scss";
import { paths } from "paths";
import { ReactComponent as Pin } from "assets/icons/pin.svg";
import classNames from "classnames";
import { useLocation } from "hooks/useLocation";
import { useTable } from "hooks/useTable";
import { useRouter } from "hooks/useRouter";

type Props = {
  allLoaded: boolean;
};

export const SelectDeliveryAddress: FC<Props> = memo(function SelectDeliveryAddress({ allLoaded }) {
  const { handleClick, handleAnimation, animation, coordinates } = useSelectDeliveryAddress();
  const { t } = useTranslation(["location", "common"]);

  return (
    <div className={style.root}>
      <div className={style.container}>
        <div className={style.top}>
          <ButtonWithIcon startIcon={<ArrowBackIosIcon />}>
            {t("button.back", { ns: "common" })}
          </ButtonWithIcon>
          <Typography className={style.title}>{t("selectDeliveryAddress")}</Typography>
          {allLoaded && (
            <Map
              handleAnimation={handleAnimation}
              className={style.map}
              children={
                <Pin
                  className={classNames(style.pin, {
                    [style.pinUp]: !animation,
                    [style.pinDown]: animation,
                  })}
                />
              }
            />
          )}
        </div>
        <div className={style.confirm}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleClick}
            disabled={!coordinates}
          >
            {t("button.selectAddress")}
          </Button>
        </div>
      </div>
    </div>
  );
});

function useSelectDeliveryAddress() {
  const { push } = useRouter();
  const { coordinates } = useLocation();
  const { table } = useTable();

  const handleClick = useCallback(async () => {
    if (coordinates && table) {
      await push(paths.confirmAddress(table.id), undefined, { preserveQuery: true });
    }
  }, [coordinates, push, table]);

  const [animation, setAnimation] = useState(false);

  const handleAnimation = useCallback(() => {
    setAnimation((prev) => !prev);
  }, []);

  return { handleClick, handleAnimation, animation, coordinates };
}
