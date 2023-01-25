import { Button } from "components/Button";
import React, { FC, memo, useContext } from "react";
import itemStyle from "styles/components/PickerListItem.module.scss";
import { ReactComponent as AddIcon } from "assets/icons/add-circle.svg";
import { ReactComponent as HighlightOffIcon } from "assets/icons/highlight-off.svg";
import { I18nextContext } from "providers/I18nextProvider";
import { Item } from "domain/models/Item";
import { useTranslation } from "react-i18next";
import { Organization } from "domain/models/Organization";
import { getFormattedPrice } from "domain/util/price";
import classNames from "classnames";
import { Typography } from "@material-ui/core";
import { Separator } from "components/Separator";

type WithActionProps = {
  viewOnly: false;
  added: boolean;
  onClick: (item: Item) => void;
};

type ViewOnlyProps = {
  viewOnly: true;
} & Omit<Partial<WithActionProps>, "viewOnly">;

type Props = (ViewOnlyProps | WithActionProps) & {
  organization: Organization;
  item: Item;
};

export const ItemPickerListItem: FC<Props> = memo(function ItemPickerListItem(
  props
) {
  const { item, organization, added, viewOnly } = props;
  const { handleClick } = useItemPickerListItem(props);
  const { lng } = useContext(I18nextContext);
  const { t } = useTranslation();

  function renderContent() {
    return (
      <>
        <div>
          <Typography component="span" className={itemStyle.label}>
            {item.name[lng]}
          </Typography>
          <div className="d-flex align-item-center">
            {added && (
              <>
                <Typography component="span" className={itemStyle.text}>
                  {t("pages.itemPicker.added")}
                </Typography>
                <Separator mh={6} size={6} />
              </>
            )}
            <Typography component="span" className={itemStyle.text}>
              {t("item.basePrice", {
                price: getFormattedPrice(
                  item.price,
                  lng,
                  organization.currency
                ),
              })}
            </Typography>
          </div>
        </div>
        {!viewOnly && added && <HighlightOffIcon className={itemStyle.alert} />}
        {!viewOnly && !added && <AddIcon className={itemStyle.primary} />}
      </>
    );
  }

  return (
    <li className={classNames({ [itemStyle.item]: viewOnly })}>
      {viewOnly ? (
        renderContent()
      ) : (
        <Button className={itemStyle.item} onClick={handleClick}>
          {renderContent()}
        </Button>
      )}
    </li>
  );
});

function useItemPickerListItem({ onClick, item }: Props) {
  function handleClick() {
    onClick?.(item);
  }

  return { handleClick };
}
