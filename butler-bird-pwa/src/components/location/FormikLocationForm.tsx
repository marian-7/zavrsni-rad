import React, { FC, memo, useCallback } from "react";
import { Form, useFormikContext } from "formik";
import { RadioLocation } from "components/location/RadioLocation";
import style from "styles/components/location/formik-location-form.module.scss";
import { UserAddress } from "domain/types/Location";
import { FormikRadioGroup } from "components/formik/FormikRadioGroup";
import { ButtonWithIcon } from "components/ButtonWithIcon";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Typography } from "@material-ui/core";
import { TextButton } from "components/TextButton";
import { Button } from "components/Button";
import { useTranslation } from "next-i18next";
import { paths } from "paths";
import { useTable } from "hooks/useTable";
import { useRouter } from "hooks/useRouter";

type Props = {
  userAddresses?: UserAddress[];
  onBack: () => void;
};

export const FormikLocationForm: FC<Props> = memo(function FormikLocationForm({
  userAddresses,
  onBack,
}) {
  const { isValid, handleRedirect } = useFormikLocationForm();

  const renderLocation = useCallback((location: UserAddress) => {
    return <RadioLocation key={location.id} location={location} />;
  }, []);

  const { t } = useTranslation("location");

  return (
    <Form className="d-flex flex-direction-column flex-1 full-width">
      <div className={style.top}>
        <ButtonWithIcon startIcon={<ArrowBackIosIcon />} onClick={onBack} className="mb-3">
          {t("button.back", { ns: "common" })}
        </ButtonWithIcon>
        <Typography className={style.label}>{t("label.locations")}</Typography>
        {userAddresses?.length ? (
          <div className={style.root}>
            <FormikRadioGroup className={style.group} name="selectedLocation">
              {userAddresses?.map(renderLocation)}
            </FormikRadioGroup>
          </div>
        ) : (
          <Typography>{t("noAddress")}</Typography>
        )}
        <TextButton className="mt-2" label={t("button.chooseOrAdd")} onClick={handleRedirect} />
      </div>

      <div className={style.confirm}>
        <Button color="primary" variant="contained" type="submit" fullWidth disabled={!isValid}>
          {t("button.confirmAddress")}
        </Button>
      </div>
    </Form>
  );
});

function useFormikLocationForm() {
  const { isValid } = useFormikContext();
  const { push } = useRouter();

  const { table } = useTable();

  const handleRedirect = useCallback(async () => {
    if (table) {
      await push(paths.address(table.id), undefined, { preserveQuery: true });
    }
  }, [push, table]);

  return { isValid, handleRedirect };
}
