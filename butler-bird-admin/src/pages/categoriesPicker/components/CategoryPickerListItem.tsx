import React, { FC, memo, useContext, MouseEvent } from "react";
import { Category } from "domain/models/Category";
import { Button } from "components/Button";
import itemStyle from "styles/components/PickerListItem.module.scss";
import { I18nextContext } from "providers/I18nextProvider";
import { useTranslation } from "react-i18next";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";
import { ReactComponent as VisibilityIcon } from "assets/icons/visibility.svg";
import { IconButton, Typography } from "@material-ui/core";
import { NavLink as Link, useParams } from "react-router-dom";
import { paths } from "paths";

interface Props {
  category: Category;
  added: boolean;
  onClick?: (category: Category) => void;
}

export const CategoryPickerListItem: FC<Props> = memo(
  function CategoryPickerListItem(props) {
    const { path, handleClick, handleLinkClick } = useCategoryPickerListItem(
      props
    );
    const { added, category, onClick } = props;
    const { lng } = useContext(I18nextContext);
    const { t } = useTranslation();

    function renderContent() {
      return (
        <>
          <div className="flex-1">
            <Typography component="span" className={itemStyle.label}>
              {category.name[lng]}
            </Typography>
            <div className="d-flex align-item-center">
              {added && (
                <>
                  <Typography component="span" className={itemStyle.text}>
                    {t("pages.categoriesPicker.added")}
                  </Typography>
                  <div className={itemStyle.separator} />
                </>
              )}
              <Typography component="span" className={itemStyle.text}>
                {t("pages.categoriesPicker.contains", {
                  count: category.items.length,
                })}
              </Typography>
            </div>
          </div>
          {onClick && (
            <IconButton component={Link} to={path} onClick={handleLinkClick}>
              <VisibilityIcon className={itemStyle.primary} />
            </IconButton>
          )}
          {onClick && added && <HighlightOffIcon className={itemStyle.alert} />}
          {onClick && !added && <AddIcon className={itemStyle.primary} />}
        </>
      );
    }

    if (onClick) {
      return (
        <li>
          <Button className={itemStyle.item} onClick={handleClick}>
            {renderContent()}
          </Button>
        </li>
      );
    }
    return <li className={itemStyle.item}>{renderContent()}</li>;
  }
);

function useCategoryPickerListItem({ category, onClick }: Props) {
  const { slug, menu } = useParams<{ slug: string; menu?: string }>();

  const path = menu
    ? paths.categoryItems(menu, category.id, slug)
    : paths.createCategoryItems(category.id, slug);

  function handleClick() {
    onClick?.(category);
  }

  function handleLinkClick(e: MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
  }

  return { path, handleClick, handleLinkClick };
}
