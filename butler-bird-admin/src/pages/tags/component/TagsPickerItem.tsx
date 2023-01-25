import React, { FC, memo } from "react";
import { Tag } from "domain/models/Tag";
import itemStyle from "styles/components/PickerListItem.module.scss";
import style from "styles/pages/tags/components/TagsPickerItem.module.scss";
import { IconButton, Typography } from "@material-ui/core";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import classNames from "classnames";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";
import { LinkButton } from "components/LinkButton";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";

interface Props {
  tag: Tag;
  added: boolean;
  onClick: (tag: Tag) => void;
  to: string;
}

export const TagsPickerItem: FC<Props> = memo(function AllergensPickerItem(
  props
) {
  const { tag, added, to } = props;
  const { handleClick } = useAllergensPickerItem(props);
  const { local } = useLocal();

  return (
    <li className={itemStyle.item}>
      <Typography
        component="span"
        className={classNames(itemStyle.label, style.label)}
      >
        {getLabel(tag.name, local)}
      </Typography>
      <IconButton onClick={handleClick}>
        {added ? (
          <HighlightOffIcon className={itemStyle.alert} />
        ) : (
          <AddIcon className={itemStyle.primary} />
        )}
      </IconButton>
      <LinkButton to={to} className={style.link}>
        <ArrowIcon />
      </LinkButton>
    </li>
  );
});

function useAllergensPickerItem({ onClick, tag }: Props) {
  function handleClick() {
    onClick(tag);
  }

  return { handleClick };
}
