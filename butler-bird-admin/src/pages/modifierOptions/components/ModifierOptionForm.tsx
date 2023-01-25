import React, { FC, memo } from "react";
import { Form } from "components/Form";
import style from "styles/pages/modifierOptions/components/ModifiersOptionForm.module.scss";
import { FormLanguagePicker } from "components/FormLanguagePicker";
import { IconButton, Typography } from "@material-ui/core";
import { ReactComponent as HelpIcon } from "../../../assets/icons/help-outline.svg";
import { FormikInput } from "components/FormikInput";
import { useTranslation } from "react-i18next";
import { useOrganization } from "hooks/useOrganization";
import { Typography as Text } from "domain/models/Typography";
import { FormikPriceInput } from "components/FormikPriceInput";
import { ReactComponent as SaveIcon } from "assets/icons/done.svg";
import { Button } from "components/Button";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { useFormikContext } from "formik";

export type ModifierOptionFormValues = {
  name: Text;
  description?: Text;
  price?: number;
  isNew?: boolean;
};

type Props = {
  optionEdit?: boolean;
  onOptionDelete?: () => void;
  removing?: boolean;
};

export const ModifierOptionForm: FC<Props> = memo(function ModifierItemsForm(
  props
) {
  const { optionEdit, removing } = props;
  const {
    t,
    organization,
    handleDeleteClick,
    isSubmitting,
  } = useModifierItemsForm(props);

  return (
    <Form className={style.form}>
      <div className={style.inputContainer}>
        <FormLanguagePicker helper={false} className={style.picker}>
          {({ pickerLng }: { pickerLng: string }) => {
            return (
              <>
                <FormikInput
                  name={`name.${pickerLng}`}
                  placeholder={t("form.placeholders.modifierItemName")}
                />
                <FormikInput
                  multiline
                  name={`description.${pickerLng}`}
                  placeholder={t("form.placeholders.modifierItemDescription")}
                  rows={3}
                />
              </>
            );
          }}
        </FormLanguagePicker>
        <div className="d-flex align-item-center mb-1">
          <Typography className={style.subtitle}>
            {t("pages.modifierItems.price")}
          </Typography>
          <IconButton
            color="primary"
            component="span"
            className={style.helpIcon}
          >
            <HelpIcon />
          </IconButton>
        </div>
        <div className={style.basePrice}>
          <FormikPriceInput
            name="price"
            withHelperText={false}
            allowNegative
            textAlign={style.priceInput}
          />
          <Typography variant="body1" className={style.currency}>
            {organization?.currency}
          </Typography>
        </div>
      </div>
      {!optionEdit ? (
        <Button
          type="submit"
          startIcon={<SaveIcon />}
          rootClassName={style.btnSaveItem}
          loading={isSubmitting}
        >
          {t("pages.modifierItems.saveModifierItem")}
        </Button>
      ) : (
        <div className={style.actions}>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            rootClassName={style.btnDelete}
            disabled={isSubmitting}
            loading={removing}
          >
            {t("buttons.delete")}
          </Button>
          <Button
            type="submit"
            startIcon={<SaveIcon className={style.saveIcon} />}
            rootClassName={style.btnSave}
            loading={isSubmitting}
            disabled={removing}
          >
            {t("buttons.saveChanges")}
          </Button>
        </div>
      )}
    </Form>
  );
});

function useModifierItemsForm({ onOptionDelete }: Props) {
  const { t } = useTranslation();
  const organization = useOrganization();
  const { isSubmitting } = useFormikContext();

  function handleDeleteClick() {
    onOptionDelete?.();
  }

  return { t, organization, handleDeleteClick, isSubmitting };
}
