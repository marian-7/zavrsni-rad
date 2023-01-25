import React, { FC, memo } from "react";
import { paths, withSlug } from "paths";
import { useFormikContext } from "formik";
import { VenueFormHeader } from "components/venueForm/VenueFormHeader";
import style from "styles/components/venueForm/VenueForm.module.scss";
import { FormikInput } from "components/FormikInput";
import { useTranslation } from "react-i18next";
import { Table, Venue } from "domain/models/Venue";
import { useLocal } from "hooks/useLocal";
import { FormikLocationSelect } from "components/venueForm/FormikLocationSelect";
import { useQueryLocations } from "hooks/useQueryLocations";
import { FormikMenusSelect } from "components/venueForm/FormikMenusSelect";
import spacing from "styles/util/spacing.module.scss";
import { useQueryMenus } from "hooks/useQueryMenues";
import { VenueSwitch } from "components/venueForm/VenueSwitch";
import { FormikTablesSelect } from "components/venueForm/FormikTablesSelect";
import { useToggleState } from "hooks/useToggleState";
import { DeleteOverlay } from "components/DeleteOverlay";
import singlePageStyle from "styles/components/SinglePage.module.scss";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Organization } from "domain/models/Organization";
import { getLabel } from "domain/util/text";
import { Form } from "components/Form";
import { FormLanguagePicker } from "components/FormLanguagePicker";
import { getTypographyError } from "domain/util/formik";
import { FormikCheckbox } from "components/FormikCheckbox";

interface Props {
  venue?: number;
  onDelete?: () => void;
  deleting?: boolean;
  organization?: Organization;
}

export const VenueForm: FC<Props> = memo(function VenueForm(props) {
  const { venue, onDelete, deleting, organization } = props;
  const {
    initialLocationName,
    initialName,
    locations,
    changeLocationTo,
    values,
    handleLocationChange,
    menus,
    handleMenusChange,
    addMenusTo,
    editTablesTo,
    tables,
    handleTablesChange,
    addTablesTo,
    handleTablesCreate,
    isSubmitting,
    deleteOverlay,
    toggleDeleteOverlay,
    viewCategoriesPath,
    bannerMessageError,
  } = useVenueForm(props);
  const { t } = useTranslation();

  return (
    <>
      <OverlayScrollbarsComponent
        className={singlePageStyle.container}
        options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
      >
        <Form className={singlePageStyle.form}>
          <VenueFormHeader
            create={!venue}
            name={initialName}
            location={initialLocationName}
            isSubmitting={isSubmitting}
            onDeleteClick={toggleDeleteOverlay}
          />
          <div className={singlePageStyle.body}>
            <FormikInput
              className={style.input}
              name={`name.${organization?.languages[0]}`}
              label={t("form.labels.venueName")}
              showErrorOnTouched
            />
            <FormikLocationSelect
              changeLocationTo={changeLocationTo}
              className={spacing.mt1}
              name="location"
              locations={locations}
            />
            <FormikMenusSelect
              className={spacing.mt4}
              name="menus"
              menus={menus}
              addMenusTo={addMenusTo}
              viewPath={viewCategoriesPath}
            />
            <FormikTablesSelect
              className={spacing.mt4}
              name="tables"
              addTo={addTablesTo}
              editTo={editTablesTo}
            />
            <FormLanguagePicker helper={false} className={spacing.mt4}>
              {({ pickerLng }) => {
                return (
                  <FormikInput
                    errorMessage={bannerMessageError}
                    className={style.input}
                    name={`bannerMessage.${pickerLng}`}
                    placeholder={t("form.placeholders.bannerMessage")}
                  />
                );
              }}
            </FormLanguagePicker>
            <FormikCheckbox
              name="takeout"
              label="Takeout"
              formControlLabelClass={style.checkbox}
            />
          </div>
          {onDelete && deleteOverlay && (
            <DeleteOverlay
              name={t("pages.venue.venue")}
              onDelete={onDelete}
              onCancelDelete={toggleDeleteOverlay}
              deleting={deleting}
            />
          )}
        </Form>
      </OverlayScrollbarsComponent>
      <VenueSwitch
        venue={venue}
        values={values}
        locations={locations}
        onLocationClick={handleLocationChange}
        menus={menus}
        onMenusChange={handleMenusChange}
        tables={tables}
        onTablesChange={handleTablesChange}
        onTablesCreate={handleTablesCreate}
      />
    </>
  );
});

function useVenueForm({ venue }: Props) {
  const [deleteOverlay, toggleDeleteOverlay] = useToggleState(false, [
    true,
    false,
  ]);
  const { local } = useLocal();
  const { data: dataLocations } = useQueryLocations();
  const { data: dataMenus } = useQueryMenus();
  const {
    initialValues,
    values,
    setFieldValue,
    isSubmitting,
  } = useFormikContext<
    Partial<
      Venue & { tables: Table & { id: number | string; __isNew?: boolean }[] }
    >
  >();
  const ctx = useFormikContext<any>();
  const bannerMessageError = getTypographyError(ctx, "bannerMessage");

  const locations = (() => {
    if (venue && !initialValues.id) {
      return [];
    } else return dataLocations ?? [];
  })();

  const menus = (() => {
    if (venue && !initialValues.id) {
      return [];
    } else return dataMenus ?? [];
  })();

  const tables = values.tables ?? [];

  let initialLocation = locations.find(
    (location) => location.id === initialValues.location
  );
  const initialLocationName = initialLocation
    ? getLabel(initialLocation?.name, local, "")
    : undefined;

  const initialName = initialValues.name
    ? getLabel(initialValues.name, local, "")
    : undefined;

  const changeLocationTo = withSlug(
    venue ? paths.venueLocationPicker(venue) : paths.venueCreateLocationPicker()
  );

  const addMenusTo = withSlug(
    venue ? paths.venueMenusPicker(venue) : paths.venueCreateMenusPicker()
  );

  const editTablesTo = withSlug(
    venue ? paths.tables(venue) : paths.venuesCreateTables()
  );

  const addTablesTo = withSlug(
    venue ? paths.venueTablesAdd(venue) : paths.venueCreateTablesAdd()
  );

  function handleLocationChange(location: number) {
    setFieldValue("location", location);
  }

  function handleMenusChange(menus: number[]) {
    setFieldValue("menus", menus);
  }

  function handleTablesChange(tables: Table[]) {
    setFieldValue("tables", tables);
  }

  function handleTablesCreate(tables: Table[]) {
    setFieldValue("tables", values.tables?.concat(tables) ?? tables);
  }

  function viewCategoriesPath(menu: number) {
    return `${withSlug(
      venue
        ? paths.venueCategories(venue, menu)
        : paths.venueCreateCategories(menu)
    )}?skip-menus=true`;
  }

  return {
    initialLocationName,
    initialName,
    locations,
    changeLocationTo,
    values,
    handleLocationChange,
    menus,
    addMenusTo,
    handleMenusChange,
    editTablesTo,
    tables,
    handleTablesChange,
    addTablesTo,
    handleTablesCreate,
    isSubmitting,
    deleteOverlay,
    toggleDeleteOverlay,
    viewCategoriesPath,
    bannerMessageError,
  };
}
