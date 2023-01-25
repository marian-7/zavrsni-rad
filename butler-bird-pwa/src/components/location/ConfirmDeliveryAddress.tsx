import React, { FC, memo, useMemo } from "react";
import style from "styles/components/location/confirm-delivery-address.module.scss";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Typography } from "@material-ui/core";
import { Button } from "components/Button";
import { useTranslation } from "next-i18next";
import { FormikInput } from "components/FormikInput";
import { getStaticMap } from "domain/services/locationsService";
import { useLocation } from "hooks/useLocation";
import { AddressForm } from "pages/tables/[id]/location/confirm";
import { Form, useFormikContext } from "formik";
import { Input } from "components/Input";
import { useRouter } from "next/router";

type Props = {
  allLoaded: boolean;
  location: AddressForm;
};

export const ConfirmDeliveryAddress: FC<Props> = memo(function ConfirmDeliveryAddress({
  allLoaded,
  location,
}) {
  const { image, isValid } = useConfirmDeliveryAddress();
  const { address } = location;
  const { t } = useTranslation(["location", "common"]);
  const { back } = useRouter();

  return (
    <Form className={style.root}>
      <div className={style.container}>
        <div className={style.top}>
          <ButtonWithIcon startIcon={<ArrowBackIosIcon />} onClick={back}>
            {t("button.back", { ns: "common" })}
          </ButtonWithIcon>
          <Typography className={style.title}>{t("selectDeliveryAddress")}</Typography>
          {allLoaded && <img className={style.smallMap} src={image} />}
          <Typography className="mt-2 mb-2">{t("addressInstructions")}</Typography>
          <Input value={address?.streetAddress ?? ""} disabled fullWidth className={style.input} />
          <FormikInput
            name="additionalInfo"
            label={t("label.staircaseApartmentFloor")}
            fullWidth
            className={style.input}
          />
        </div>
        <div className={style.confirm}>
          <Button color="primary" variant="contained" fullWidth disabled={!isValid} type="submit">
            {t("button.confirmAddress")}
          </Button>
        </div>
      </div>
    </Form>
  );
});

function useConfirmDeliveryAddress() {
  const { coordinates } = useLocation();
  const { isValid } = useFormikContext<AddressForm>();

  const image = useMemo(() => {
    if (coordinates) {
      return getStaticMap(`${coordinates.lat},${coordinates.lng}`);
    }
  }, [coordinates]);

  return {
    image,
    isValid,
  };
}
