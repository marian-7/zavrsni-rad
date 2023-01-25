import React, { FC, memo } from "react";
import { Category } from "domain/models/Category";
import { useTranslation } from "react-i18next";
import { ItemChip } from "./ItemChip";
import { paths } from "paths";
import { useParams } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import { DragDrop } from "components/DragDrop";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";

type Props = {
  value: Category[];
  onValueChange: (value: Category[]) => void;
  onDelete: (id: number) => void;
};

export const CategoriesSelect: FC<Props> = memo(function CategoriesSelect(
  props
) {
  const { value, onValueChange, onDelete } = props;
  const { local, t, slug, menu } = useCategoriesSelect();

  function renderCategoryItem() {
    return function (category: Category, index: number) {
      const toItemsView = `${paths.categoryItems(
        menu,
        category.id,
        slug
      )}?skip-categories=true`;

      return (
        <Draggable
          key={category.id}
          draggableId={category.id.toString()}
          index={index}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <ItemChip
                key={category.id}
                id={category.id}
                title={getLabel(category.name, local)}
                subtitle={t("components.item.item", {
                  count: category.items.length,
                })}
                onDelete={onDelete}
                toItemsView={toItemsView}
              />
            </div>
          )}
        </Draggable>
      );
    };
  }

  return (
    <>
      {value?.length > 0 && (
        <DragDrop
          value={value}
          onValueChange={onValueChange}
          renderItem={renderCategoryItem()}
        />
      )}
    </>
  );
});

function useCategoriesSelect() {
  const { t } = useTranslation();
  const { slug, menu } = useParams<{ slug: string; menu?: string }>();
  const { local } = useLocal();

  return { t, local, slug, menu };
}
