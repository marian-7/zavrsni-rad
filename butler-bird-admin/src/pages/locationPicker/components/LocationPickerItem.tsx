import React, { FC, memo } from "react";
import itemStyle from "styles/components/PickerListItem.module.scss";
import { Button } from "components/Button";
import { Typography } from "@material-ui/core";
import { ReactComponent as CheckIcon } from "assets/icons/check-circle.svg";
import { Location } from "domain/models/Location";
import { useLocal } from "hooks/useLocal";
import classNames from "classnames";
import style from "styles/pages/locationsPicker/components/LocationPickerItem.module.scss";
import { useTranslation } from "react-i18next";
import { getLabel } from "domain/util/text";

interface Props {
  location: Location;
  selected: boolean;
  onClick: (location: number) => void;
}

export const LocationPickerItem: FC<Props> = memo(function LocationPickerItem(
  props
) {
  const { location, selected } = props;
  const { handleClick } = useLocationPickerItem(props);
  const { local } = useLocal();
  const { t } = useTranslation();

  return (
    <li>
      <Button
        className={itemStyle.item}
        onClick={handleClick}
        disabled={selected}
      >
        <div className="flex-1">
          <Typography
            component="span"
            className={classNames(itemStyle.label, {
              [itemStyle.spacing]: !selected,
            })}
          >
            {getLabel(location.name, local)}
          </Typography>
          {selected && (
            <Typography component="span" className={itemStyle.text}>
              {t("pages.locationPicker.selected")}
            </Typography>
          )}
        </div>
        {!selected && <CheckIcon className={style.icon} />}
      </Button>
    </li>
  );
});

function useLocationPickerItem({ onClick, location }: Props) {
  function handleClick() {
    onClick(location.id);
  }

  return { handleClick };
}
