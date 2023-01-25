import React, { FC, memo, useCallback } from "react";
import { Session } from "next-auth";
import { Typography } from "@material-ui/core";
import { Address } from "./Address";
import { Button } from "components/Button";
import { useTranslation } from "next-i18next";
import style from "styles/components/location/address-details.module.scss";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import { useLocation } from "hooks/useLocation";
import { FormikInput } from "components/FormikInput";
import { Form } from "formik";
import { DeleteAddress } from "components/location/DeleteAddress";
import { useRouter } from "hooks/useRouter";
import { paths } from "paths";
import * as queryString from "querystring";
import { useTable } from "hooks/useTable";

type Props = {
  session?: Session;
  showDoneButton: boolean;
  onDelete?: () => void;
};

enum Modal {
  DeleteAddress = "delete-address",
}

export const AddressDetails: FC<Props> = memo(function AddressDetails({
  showDoneButton,
  onDelete,
}) {
  const { back, location, showDeleteModal, query } = useAddressDetails();
  const { t } = useTranslation(["location", "common"]);

  return (
    <Form className={style.root}>
      <div className={style.container}>
        <div className={style.top}>
          <ButtonWithIcon startIcon={<ArrowBackIosIcon />} onClick={back}>
            {t("button.back", { ns: "common" })}
          </ButtonWithIcon>
          <Typography className={style.title}>{t("address")}</Typography>
          {location && <Address location={location} />}
          <Typography className={style.instructions}>{t("label.deliveryInstructions")}</Typography>
          <FormikInput
            name="deliveryInstructions"
            label={t("label.courierInstructions")}
            fullWidth
          />
        </div>
        <div className={style.confirm}>
          <>
            {showDoneButton ? (
              <Button fullWidth color="primary" variant="contained" type="submit">
                {t("button.done", { ns: "common" })}
              </Button>
            ) : (
              <>
                <Button
                  color="secondary"
                  variant="contained"
                  className={style.removeBtn}
                  onClick={showDeleteModal}
                >
                  {t("button.remove", { ns: "common" })}
                </Button>
                <Button color="primary" variant="contained" className={style.btn} type="submit">
                  {t("button.confirm", { ns: "common" })}
                </Button>
              </>
            )}
          </>
        </div>
        <DeleteAddress isOpen={query.modal === Modal.DeleteAddress} onDelete={onDelete} />
      </div>
    </Form>
  );
});

function useAddressDetails() {
  const { back, push, query } = useRouter();
  const { location } = useLocation();
  const { table } = useTable();

  const showDeleteModal = useCallback(async () => {
    if (table) {
      await push(
        `${paths.addressDetails(table.id)}?${queryString.stringify({
          ...query,
          modal: Modal.DeleteAddress,
        })}`
      );
    }
  }, [push, query, table]);

  return { back, location, showDeleteModal, query };
}
