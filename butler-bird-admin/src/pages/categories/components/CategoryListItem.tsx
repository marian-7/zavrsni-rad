import React, { FC, memo, useContext } from "react";
import { Category } from "domain/models/Category";
import listItemStyle from "styles/components/ListItem.module.scss";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import style from "styles/pages/categories/components/CategoryListItem.module.scss";
import classNames from "classnames";
import { LinkButton } from "components/LinkButton";
import { paths } from "paths";
import { useTranslation } from "react-i18next";
import { I18nextContext } from "providers/I18nextProvider";
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { getLabel } from "domain/util/text";

interface Props {
  category: Category;
}

export const CategoryListItem: FC<Props> = memo(function CategoryListItem({
  category,
}) {
  const { slug } = useCategoryListItem();
  const { t } = useTranslation();
  const { lng } = useContext(I18nextContext);

  return (
    <li>
      <LinkButton
        to={paths.category(category.id, slug)}
        className={classNames(listItemStyle.link, style.link)}
        activeClassName={listItemStyle.linkActive}
      >
        <Typography className={classNames(listItemStyle.title, style.title)}>
          {getLabel(category.name, lng)}
        </Typography>
        <div className="d-flex align-item-center justify-content-space-between">
          <Typography className={listItemStyle.label}>
            {t("pages.categories.items", { count: category.items.length })}
          </Typography>
          <ArrowIcon className={classNames(listItemStyle.icon, style.icon)} />
        </div>
      </LinkButton>
    </li>
  );
});

function useCategoryListItem() {
  const { slug } = useParams<{ slug: string }>();

  return { slug };
}
