import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { FC, memo, useCallback, useState } from "react";
import style from "styles/components/ItemForm.module.scss";
import singlePageHeaderStyle from "styles/components/SinglePageHeader.module.scss";
import { IconButton, Typography } from "@material-ui/core";
import { Button } from "components/Button";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { FormLanguagePicker } from "components/FormLanguagePicker";
import { FormikInput } from "components/FormikInput";
import { DeleteOverlay } from "components/DeleteOverlay";
import { Item } from "domain/models/Item";
import { getFormattedPrice } from "domain/util/price";
import { useTranslation } from "react-i18next";
import { useOrganization } from "hooks/useOrganization";
import { ReactComponent as HelpIcon } from "assets/icons/help-outline.svg";
import { ReactComponent as ModifyIcon } from "assets/icons/modify.svg";
import classNames from "classnames";
import { Typography as Text } from "domain/models/Typography";
import { Tag } from "domain/models/Tag";
import { LinkButton } from "components/LinkButton";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import { FormikTagsSelect } from "components/FormikTagsSelect";
import { FormikOptionGroupsSelect } from "components/FormikOptionGroupsSelect";
import { FormikImagePicker } from "components/FormikImagePicker";
import { Image } from "domain/models/Image";
import { FormikPriceInput } from "components/FormikPriceInput";
import { ItemFormRouteSwitch } from "./components/ItemFormRouteSwitch";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";
import { Form } from "components/Form";
import { OptionGroup } from "domain/models/OptionGroup";

export type ItemFormValues = {
  name: Text;
  description?: Text;
  longDescription?: Text;
  price?: number | string;
  optionGroups: OptionGroup[];
  tags?: Tag[];
  image?: File | Image | null;
  modifierName?: string;
};

interface Props {
  item?: Item;
  isSubmitting: boolean;
  onItemDelete?: () => void;
  isDeleting?: boolean;
  toOptionGroupsPicker: string;
  toTagsPicker: string;
  onAllergensChange?: (tags: Tag[]) => void;
}

export const ItemForm: FC<Props> = memo(function ItemForm(props) {
  const {
    item,
    onItemDelete,
    toTagsPicker,
    toOptionGroupsPicker,
    isDeleting,
    isSubmitting,
  } = props;
  const {
    local,
    t,
    organization,
    handleCancelDelete,
    handleDeleteClick,
    deleteOverlayOpen,
  } = useItemForm();

  return (
    <>
      <OverlayScrollbarsComponent
        className={style.container}
        options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
      >
        <Form>
          <div className={singlePageHeaderStyle.header}>
            <div className="flex-1 flex-direction-column align-self-stretch">
              <Typography className={style.name}>
                {item && getLabel(item.name, local)}
              </Typography>
              <Typography variant="body1">
                {item?.price &&
                  organization &&
                  t("components.item.basePrice", {
                    price: getFormattedPrice(
                      item.price,
                      local,
                      organization.currency
                    ),
                  })}
              </Typography>
            </div>
            {!!onItemDelete && (
              <Button
                onClick={handleDeleteClick}
                variant="text"
                color="primary"
                size="medium"
                startIcon={<DeleteIcon />}
                rootClassName={style.btnDelete}
                disabled={isSubmitting}
              >
                {t("buttons.delete")}
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="medium"
              rootClassName={style.btnSave}
              loading={isSubmitting}
            >
              {t("buttons.saveChanges")}
            </Button>
          </div>
          <div className={style.body}>
            <div className={style.row}>
              <FormLanguagePicker>
                {({ pickerLng }) => {
                  return (
                    <div className={style.inputsContainer}>
                      <FormikInput
                        name={`name.${pickerLng}`}
                        placeholder={t("form.placeholders.itemName")}
                        className={style.input}
                        withHelperText={false}
                      />
                      <FormikInput
                        name={`description.${pickerLng}`}
                        placeholder={t("form.placeholders.itemDescription")}
                        className={style.input}
                        withHelperText={false}
                      />
                      <FormikInput
                        name={`longDescription.${pickerLng}`}
                        placeholder={t("form.placeholders.itemLongDescription")}
                        className={style.inputMultiline}
                        multiline
                        rows={5}
                        withHelperText={false}
                      />
                    </div>
                  );
                }}
              </FormLanguagePicker>
            </div>
            <div className={style.row}>
              <div className="d-flex align-item-center mb-3">
                <Typography className={style.subtitle}>
                  {t("components.itemForm.basePrice")}
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
                  textAlign={style.priceInput}
                />
                <Typography variant="body1" className={style.currency}>
                  {organization?.currency}
                </Typography>
              </div>
            </div>
            <div className={style.row}>
              <div className="d-flex align-item-center mb-1">
                <Typography className={style.subtitle}>
                  {t("components.itemForm.optionGroups")}
                </Typography>
                <IconButton
                  color="primary"
                  component="span"
                  className={style.helpIcon}
                >
                  <HelpIcon />
                </IconButton>
              </div>
              <div className={classNames(style.chips, style.chipsDraggable)}>
                <FormikOptionGroupsSelect name="optionGroups" />
                <LinkButton
                  startIcon={<ModifyIcon />}
                  to={toOptionGroupsPicker}
                  classes={{
                    root: classNames(style.btnAdd, style.btnAddDraggable),
                  }}
                  color="primary"
                >
                  {t("components.itemForm.modifiers")}
                </LinkButton>
              </div>
            </div>
            <div className={style.row}>
              <Typography className={classNames(style.subtitle, "mb-1")}>
                {t("components.itemForm.tags")}
              </Typography>
              <div className={style.chips}>
                <FormikTagsSelect name="tags" />
                <LinkButton
                  startIcon={<AddIcon />}
                  to={toTagsPicker}
                  classes={{ root: style.btnAdd }}
                  color="primary"
                >
                  {t("components.itemForm.addTags")}
                </LinkButton>
              </div>
            </div>
            <div className={style.row}>
              <FormikImagePicker name="image" />
            </div>
          </div>
          {onItemDelete && deleteOverlayOpen && (
            <DeleteOverlay
              name={t("components.itemForm.item")}
              onDelete={onItemDelete}
              onCancelDelete={handleCancelDelete}
              deleting={isDeleting}
            />
          )}
        </Form>
      </OverlayScrollbarsComponent>
      <ItemFormRouteSwitch />
    </>
  );
});

function useItemForm() {
  const { t } = useTranslation();
  const { local } = useLocal();
  const organization = useOrganization();
  const [deleteOverlayOpen, setDeleteOverlayOpen] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setDeleteOverlayOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteOverlayOpen(false);
  }, []);

  return {
    t,
    organization,
    handleDeleteClick,
    handleCancelDelete,
    deleteOverlayOpen,
    local,
  };
}
