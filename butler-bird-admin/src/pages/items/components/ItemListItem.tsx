import React, { FC, memo, useContext } from "react";
import { Item } from "domain/models/Item";
import listItemStyle from "styles/components/ListItem.module.scss";
import { paths, withSlug } from "paths";
import classNames from "classnames";
import style from "styles/pages/categories/components/CategoryListItem.module.scss";
import { Typography } from "@material-ui/core";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import { LinkButton } from "components/LinkButton";
import { useTranslation } from "react-i18next";
import { I18nextContext } from "providers/I18nextProvider";
import { getFormattedPrice } from "domain/util/price";
import { Organization } from "domain/models/Organization";

interface Props {
  item: Item;
  organization: Organization;
}

export const ItemListItem: FC<Props> = memo(function ItemListItem(props) {
  const { item, organization } = props;
  useItemListItem();
  const { t } = useTranslation();
  const { lng } = useContext(I18nextContext);

  return (
    <li>
      <LinkButton
        to={withSlug(paths.item(item.id))}
        className={classNames(listItemStyle.link, style.link)}
        activeClassName={listItemStyle.linkActive}
      >
        <Typography className={classNames(listItemStyle.title, style.title)}>
          {item.name[lng]}
        </Typography>
        <div className="d-flex align-item-center justify-content-space-between">
          <Typography className={listItemStyle.label}>
            {t("item.basePrice", {
              price: getFormattedPrice(item.price, lng, organization.currency),
            })}
          </Typography>
          <ArrowIcon className={classNames(listItemStyle.icon, style.icon)} />
        </div>
      </LinkButton>
    </li>
  );
});

function useItemListItem() {}
