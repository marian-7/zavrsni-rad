import React, { FC, memo } from "react";
import itemStyle from "styles/components/PickerListItem.module.scss";
import { Typography, IconButton } from "@material-ui/core";
import { useLocal } from "hooks/useLocal";
import { useTranslation } from "react-i18next";
import { LinkButton } from "components/LinkButton";
import { getLabel } from "domain/util/text";
import { OptionGroup as OG } from "domain/models/OptionGroup";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import { ReactComponent as VisibilityIcon } from "assets/icons/visibility.svg";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";

interface OptionGroup extends OG {
  hasItem: boolean;
}

interface Props {
  modifier: OptionGroup;
  to: string;
  onAddClick?: (option: OptionGroup) => void;
  onRemoveClick?: (option: OptionGroup) => void;
}

export const ModifiersPickerItem: FC<Props> = memo(function ModifiersPickerItem(
  props
) {
  const { modifier, to } = props;
  const { handleClick } = useModifiersPickerItem(props);
  const { local } = useLocal();
  const { t } = useTranslation();

  return (
    <li className={itemStyle.item}>
      <div className="flex-1">
        <Typography component="span" className={itemStyle.label}>
          {getLabel(modifier.name, local)}
        </Typography>
        {modifier.hasItem && (
          <Typography component="span" className={itemStyle.text}>
            {t("pages.modifiers.added")}
          </Typography>
        )}
      </div>
      <LinkButton to={to} className={itemStyle.iconButton}>
        <VisibilityIcon className={itemStyle.primary} />
      </LinkButton>
      <IconButton onClick={handleClick}>
        {modifier.hasItem ? (
          <HighlightOffIcon className={itemStyle.alert} />
        ) : (
          <AddIcon className={itemStyle.primary} />
        )}
      </IconButton>
    </li>
  );
});

function useModifiersPickerItem({
  onAddClick,
  onRemoveClick,
  modifier,
}: Props) {
  function handleClick() {
    if (modifier.hasItem) {
      onRemoveClick?.(modifier);
    } else {
      onAddClick?.(modifier);
    }
  }

  return { handleClick };
}
