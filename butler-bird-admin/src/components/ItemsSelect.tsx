import React, { FC, memo } from "react";
import { Item } from "domain/models/Item";
import { Organization } from "domain/models/Organization";
import { ItemChip } from "components/ItemChip";
import { getFormattedPrice } from "domain/util/price";
import { useOrganization } from "hooks/useOrganization";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-beautiful-dnd";
import { DragDrop } from "components/DragDrop";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";

type Props = {
  value: Item[];
  onValueChange: (value: Item[]) => void;
  onDelete: (id: number) => void;
};

export const ItemsSelect: FC<Props> = memo(function ItemsSelect(props) {
  const { value, onValueChange, onDelete } = props;
  const { organization, local, t } = useItemsSelect();

  function renderItem(organization: Organization) {
    return function (item: Item, index: number) {
      return (
        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <ItemChip
                key={item.id}
                id={item.id}
                title={getLabel(item.name, local)}
                subtitle={t("components.item.basePrice", {
                  price: getFormattedPrice(
                    item.price,
                    local,
                    organization.currency
                  ),
                })}
                onDelete={onDelete}
              />
            </div>
          )}
        </Draggable>
      );
    };
  }

  return (
    <>
      {organization && value?.length > 0 && (
        <DragDrop
          value={value}
          onValueChange={onValueChange}
          renderItem={renderItem(organization)}
        />
      )}
    </>
  );
});

function useItemsSelect() {
  const { t } = useTranslation();
  const organization = useOrganization();
  const { local } = useLocal();

  return { organization, local, t };
}
