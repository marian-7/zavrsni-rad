import React, { FC, memo, useCallback, useMemo, useState } from "react";
import style from "styles/components/MenuForm.module.scss";
import { useFormikContext } from "formik";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { CustomRoute } from "components/CustomRoute";
import { paths } from "paths";
import { CategoriesPickerPage } from "pages/categoriesPicker/CategoriesPickerPage";
import { useTranslation } from "react-i18next";
import { Menu } from "domain/models/Menu";
import { Typography as Text } from "../domain/models/Typography";
import { Typography } from "@material-ui/core";
import { Button } from "./Button";
import { FormikInput } from "./FormikInput";
import { ReactComponent as DeleteIcon } from "assets/icons/delete.svg";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import { FormikTimePicker } from "./FormikTimePicker";
import classNames from "classnames";
import { DeleteOverlay } from "./DeleteOverlay";
import { FormLanguagePicker } from "./FormLanguagePicker";
import { FormikCategoriesSelect } from "./FormikCategoriesSelect";
import { getFormattedTime } from "domain/util/menu";
import { CategoryItemsPage } from "pages/categoryItems/CategoryItemsPage";
import { Switch } from "react-router-dom";
import { useQuery } from "react-query";
import { categoriesService } from "domain/services/categoriesService";
import { mapData } from "domain/util/axios";
import { keyBy } from "lodash";
import { LinkButton } from "components/LinkButton";
import singlePageHeaderStyle from "styles/components/SinglePageHeader.module.scss";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";
import { Form } from "components/Form";
import { Image } from "../domain/models/Image";
import { FormikImagePicker } from "./FormikImagePicker";

export type MenuFormValues = {
  name: Text;
  description: Text;
  activeTimeStart?: string | null;
  activeTimeEnd?: string | null;
  categories?: number[];
  image?: File | Image | null;
};

interface Props {
  menu?: Menu;
  toCategoriesPicker: string;
  onMenuDelete?: () => void;
  deleting?: boolean;
}

export const MenuForm: FC<Props> = memo(function MenuForm(props) {
  const { menu, toCategoriesPicker, onMenuDelete, deleting } = props;
  const {
    t,
    local,
    handleDeleteClick,
    handleCancelDelete,
    deleteOverlayOpen,
    categories,
    handleCategoriesChange,
    isSubmitting,
    timePickerError
  } = useMenuForm();

  return (
    <>
      <OverlayScrollbarsComponent
        className={style.container}
        options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
      >
        <Form>
          <div className={singlePageHeaderStyle.header}>
            <div className="flex-1 flex-direction-column align-self-stretch">
              <Typography
                className={classNames(style.name, {
                  "mb-1": menu?.activeTimeStart
                })}
              >
                {menu && getLabel(menu.name, local)}
              </Typography>
              <Typography variant="body1">
                {menu?.activeTimeStart && getFormattedTime(menu)}
              </Typography>
            </div>
            {onMenuDelete && (
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
            <FormLanguagePicker>
              {({ pickerLng }) => {
                return (
                  <>
                    <div className={style.row}>
                      <FormikInput
                        name={`name.${pickerLng}`}
                        placeholder={t("form.placeholders.menuName")}
                        className={style.input}
                        withHelperText={false}
                      />
                    </div>
                    <div
                      className={classNames(
                        style.pickerRow,
                        "d-flex align-item-center"
                      )}
                    >
                      <Typography
                        className={classNames(
                          style.subtitle,
                          style.pickerSubtitle
                        )}
                      >
                        {t("components.menuForm.activeFrom")}
                      </Typography>
                      <FormikTimePicker
                        name="activeTimeStart"
                        withHelperText
                        errorMessage={undefined}
                      />
                      <span className={style.line}>-</span>
                      <FormikTimePicker
                        name="activeTimeEnd"
                        withHelperText
                        errorMessage={timePickerError}
                      />
                    </div>
                    <div className={style.row}>
                      <Typography
                        className={classNames(style.subtitle, "mb-1")}
                      >
                        {t("components.menuForm.categoriesOfProducts")}
                      </Typography>
                      <div className={style.categories}>
                        <FormikCategoriesSelect
                          name="categories"
                          categories={categories}
                        />
                        <LinkButton
                          startIcon={<AddIcon />}
                          to={toCategoriesPicker}
                          classes={{ root: style.btnAdd }}
                        >
                          {t("components.menuForm.addCategories")}
                        </LinkButton>
                      </div>
                    </div>
                    <div className={style.row}>
                      <Typography
                        className={classNames(style.subtitle, "mb-3")}
                      >
                        {t("components.menuForm.description")}
                      </Typography>
                      <FormikInput
                        name={`description.${pickerLng}`}
                        placeholder={t("form.placeholders.menuDescription")}
                        className={style.inputDescription}
                        multiline
                        rows={4}
                        withHelperText={false}
                      />
                    </div>
                    <div className={style.row}>
                      <FormikImagePicker name="image" />
                    </div>
                  </>
                );
              }}
            </FormLanguagePicker>
          </div>
        </Form>
        {onMenuDelete && deleteOverlayOpen && (
          <DeleteOverlay
            name={t("components.menuForm.menu")}
            onDelete={onMenuDelete}
            onCancelDelete={handleCancelDelete}
            deleting={deleting}
          />
        )}
      </OverlayScrollbarsComponent>
      <Switch>
        <CustomRoute
          type="protected"
          path={[paths.categoryItems(), paths.createCategoryItems()]}
        >
          <CategoryItemsPage />
        </CustomRoute>
        <CustomRoute
          type="protected"
          path={[paths.createCategoriesPicker(), paths.categoriesPicker()]}
        >
          <CategoriesPickerPage
            onCategoriesChange={handleCategoriesChange}
            selected={categories ?? []}
          />
        </CustomRoute>
      </Switch>
    </>
  );
});

function useMenuForm() {
  const { t } = useTranslation();
  const { local } = useLocal();
  const {
    values,
    setFieldValue,
    errors,
    isSubmitting,
    submitCount
  } = useFormikContext<MenuFormValues>();
  const { categories: containedCategories } = values;
  const [deleteOverlayOpen, setDeleteOverlayOpen] = useState(false);

  const { data: categoriesData } = useQuery("categories", () =>
    categoriesService.getCategories().then(mapData)
  );

  const categoriesRecord = keyBy(categoriesData, "id");
  const categories =
    containedCategories
      ?.map((id) => categoriesRecord[id])
      .filter((id) => !!id) ?? [];

  const handleDeleteClick = useCallback(() => {
    setDeleteOverlayOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteOverlayOpen(false);
  }, []);

  const timePickerError = useMemo(
    () =>
      submitCount > 0 && errors.activeTimeEnd
        ? t(errors.activeTimeEnd)
        : undefined,
    [errors.activeTimeEnd, submitCount, t]
  );

  const handleCategoriesChange = useCallback(
    (categories: number[]) => {
      setFieldValue("categories", categories);
    },
    [setFieldValue]
  );

  return {
    t,
    local,
    handleDeleteClick,
    handleCancelDelete,
    deleteOverlayOpen,
    categories,
    handleCategoriesChange,
    isSubmitting,
    timePickerError,
    values
  };
}
