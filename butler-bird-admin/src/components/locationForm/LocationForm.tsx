import React, { FC, memo } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import style from "styles/components/locationForm/LocationForm.module.scss";
import singlePageHeaderStyle from "styles/components/SinglePageHeader.module.scss";
import { IconButton, Typography } from "@material-ui/core";
import { Location, Pin } from "domain/models/Location";
import { useLocal } from "hooks/useLocal";
import { Button } from "components/Button";
import { useTranslation } from "react-i18next";
import { ReactComponent as DeleteIcon } from "assets/icons/highlight-off.svg";
import { useToggleState } from "hooks/useToggleState";
import { DeleteOverlay } from "components/DeleteOverlay";
import { FormikInput } from "components/FormikInput";
import { ReactComponent as HelpIcon } from "assets/icons/help-outline.svg";
import classNames from "classnames";
import { Typography as Text } from "domain/models/Typography";
import { FormikLocationMapSelect } from "components/locationForm/FormikLocationMapSelect";
import { getLabel } from "domain/util/text";
import { Organization } from "domain/models/Organization";
import { Form } from "components/Form";

export type LocationFormValues = {
  name: Text;
  address: string;
  pins: Pin[];
};

type Props = {
  location?: Location;
  isSubmitting?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  organization?: Organization;
};

export const LocationForm: FC<Props> = memo(function LocationForm(props) {
  const { location, onDelete, isDeleting, isSubmitting, organization } = props;
  const { local, t, deleteOverlay, toggleDeleteOverlay } = useLocationForm();

  return (
    <OverlayScrollbarsComponent
      className={style.container}
      options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
    >
      <Form>
        <div className={singlePageHeaderStyle.header}>
          <div className="flex-1 flex-direction-column align-self-stretch">
            <Typography className={style.label}>
              {location?.name && getLabel(location.name, local)}
            </Typography>
            <Typography>{location?.address}</Typography>
          </div>
          {onDelete && (
            <Button
              startIcon={<DeleteIcon />}
              color="primary"
              variant="text"
              className={style.delete}
              disabled={isSubmitting}
              onClick={toggleDeleteOverlay}
            >
              {t("buttons.delete")}
            </Button>
          )}
          <Button
            color="primary"
            variant="contained"
            className={style.save}
            type="submit"
            loading={isSubmitting}
          >
            {t("buttons.saveChanges")}
          </Button>
        </div>
        <div className={style.body}>
          <div className={style.row}>
            <FormikInput
              label={
                <Typography className={classNames(style.subtitle)}>
                  {t("components.locationForm.locationName")}
                </Typography>
              }
              name={`name.${organization?.languages[0]}`}
              placeholder={t("form.placeholders.locationName")}
              withHelperText
              className={style.input}
            />
          </div>
          <div className={style.row}>
            <div className={style.subtitleWithHelper}>
              <Typography className={style.subtitle}>
                {t("components.locationForm.address")}
              </Typography>
              <IconButton
                color="primary"
                component="span"
                className={style.helpIcon}
              >
                <HelpIcon />
              </IconButton>
            </div>
            <FormikLocationMapSelect name="pins" />
          </div>
        </div>
      </Form>
      {onDelete && deleteOverlay && (
        <DeleteOverlay
          name={t("components.locationForm.location")}
          onDelete={onDelete}
          onCancelDelete={toggleDeleteOverlay}
          deleting={isDeleting}
        />
      )}
    </OverlayScrollbarsComponent>
  );
});

function useLocationForm() {
  const { t } = useTranslation();
  const { local } = useLocal();
  const [deleteOverlay, toggleDeleteOverlay] = useToggleState(false, [
    true,
    false,
  ]);

  return {
    local,
    t,
    deleteOverlay,
    toggleDeleteOverlay,
  };
}
