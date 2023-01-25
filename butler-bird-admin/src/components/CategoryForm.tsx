import React, { FC, memo, useCallback, useState } from "react";
import { useFormikContext } from "formik";
import style from "styles/components/CategoryForm.module.scss";
import singlePageHeaderStyle from "styles/components/SinglePageHeader.module.scss";
import { Typography } from "@material-ui/core";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";
import { Category } from "domain/models/Category";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import { FormikInput } from "./FormikInput";
import { useOrganization } from "hooks/useOrganization";
import { FormikImagePicker } from "./FormikImagePicker";
import { Typography as Text } from "../domain/models/Typography";
import { Item } from "domain/models/Item";
import { Image } from "domain/models/Image";
import { FormikItemsSelect } from "./FormikItemsSelect";
import { paths } from "paths";
import { ItemsPickerPage } from "pages/itemsPicker/ItemsPickerPage";
import { CustomRoute } from "./CustomRoute";
import { FormLanguagePicker } from "./FormLanguagePicker";
import { DeleteOverlay } from "./DeleteOverlay";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";
import { Form } from "components/Form";
import { useQuery } from "react-query";
import { itemsService } from "domain/services/itemsService";
import { mapData } from "domain/util/axios";
import { LinkButton } from "components/LinkButton";

export type CategoryFormValues = {
  name: Text;
  description: Text;
  items?: number[];
  image?: File | Image | null;
};

type Props = {
  category?: Category;
  toItemPicker: string;
  onItemAdd?: (item: Item) => void;
  onItemRemove?: (value: number) => void;
  onCategoryDelete?: () => void;
  deleting?: boolean;
};

export const CategoryForm: FC<Props> = memo(function CategoryForm(props) {
  const { category, toItemPicker, onCategoryDelete, deleting } = props;
  const {
    t,
    local,
    handleDeleteClick,
    handleCancelDelete,
    deleteOverlayOpen,
    containedItems,
    itemsData,
    isSubmitting,
  } = useCategoryForm();

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
                {category && getLabel(category.name, local)}
              </Typography>
              <Typography variant="body1">
                {category &&
                  containedItems &&
                  t("components.categoryForm.item", {
                    count: containedItems.length,
                  })}
              </Typography>
            </div>
            {!!onCategoryDelete && (
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
                    <>
                      <FormikInput
                        name={`name.${pickerLng}`}
                        placeholder={t("form.placeholders.categoryName")}
                        className={style.input}
                        withHelperText={false}
                      />
                      <FormikInput
                        name={`description.${pickerLng}`}
                        placeholder={t("form.placeholders.categoryDescription")}
                        className={style.input}
                        withHelperText={false}
                      />
                    </>
                  );
                }}
              </FormLanguagePicker>
            </div>
            <div className={style.row}>
              <Typography className={style.itemsSubtitle}>
                {t("components.categoryForm.itemsContained")}
              </Typography>
              <div className={style.items}>
                <FormikItemsSelect name="items" items={itemsData} />
                <LinkButton
                  startIcon={<AddIcon />}
                  to={toItemPicker}
                  classes={{ root: style.btnAdd }}
                >
                  {t("components.categoryForm.addItems")}
                </LinkButton>
              </div>
            </div>
            <div className={style.row}>
              <Typography className={style.subtitle}>
                {t("components.categoryForm.previewPhoto")}
              </Typography>
              <FormikImagePicker name="image" />
            </div>
          </div>
          {onCategoryDelete && deleteOverlayOpen && (
            <DeleteOverlay
              name={t("components.categoryForm.category")}
              onDelete={onCategoryDelete}
              onCancelDelete={handleCancelDelete}
              deleting={deleting}
            />
          )}
        </Form>
      </OverlayScrollbarsComponent>
      <CustomRoute
        exact
        type="protected"
        path={[paths.createItemsPicker(), paths.itemsPicker()]}
      >
        <ItemsPickerPage />
      </CustomRoute>
    </>
  );
});

function useCategoryForm() {
  const { t } = useTranslation();
  const organization = useOrganization();
  const { local } = useLocal();
  const { values, isSubmitting } = useFormikContext<CategoryFormValues>();
  const { items: containedItems } = values;
  const [deleteOverlayOpen, setDeleteOverlayOpen] = useState(false);

  const { data: items } = useQuery("items", () =>
    itemsService.getItems().then(mapData)
  );

  const itemsData = items ?? [];

  const handleDeleteClick = useCallback(() => {
    setDeleteOverlayOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteOverlayOpen(false);
  }, []);

  return {
    t,
    local,
    organization,
    deleteOverlayOpen,
    handleDeleteClick,
    handleCancelDelete,
    containedItems,
    itemsData,
    isSubmitting,
  };
}
