import React, { FC, memo } from "react";
import { ChipsSelect, ChipsSelectProps } from "components/ChipsSelect";
import { LocationChip } from "components/venueForm/LocationChip";
import { ReactComponent as EditIcon } from "assets/icons/edit.svg";
import { useTranslation } from "react-i18next";
import { Location } from "domain/models/Location";
import { useField } from "formik";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";

interface Props extends ChipsSelectProps {
  name: string;
  locations: Location[];
  changeLocationTo: string;
}

export const FormikLocationSelect: FC<Props> = memo(
  function FormikLocationSelect(props) {
    const { changeLocationTo, ...rest } = props;
    const { handleRemove, location, local } = useFormikLocationSelect(props);
    const { t } = useTranslation();

    return (
      <ChipsSelect
        label={t("form.labels.locationSelect")}
        action={{
          label: t("buttons.changeLocation"),
          icon: <EditIcon />,
          to: changeLocationTo,
        }}
        {...rest}
      >
        {location && (
          <LocationChip
            label={getLabel(location.name, local)}
            onDelete={handleRemove}
          />
        )}
      </ChipsSelect>
    );
  }
);

function useFormikLocationSelect({ name, locations }: Props) {
  const [{ value }, , { setValue }] = useField(name);
  const { local } = useLocal();

  const location = locations.find((location) => location.id === value);

  function handleRemove() {
    setValue(null);
  }

  return { handleRemove, location, local };
}
