import React, { FC, memo, useCallback } from "react";
import { ItemChip } from "components/ItemChip";
import { paths, withSlug } from "paths";
import { useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";
import { OptionGroup } from "domain/models/OptionGroup";
import { DragDrop } from "components/DragDrop";
import { Draggable } from "react-beautiful-dnd";

type Props = {
  value: OptionGroup[];
  onValueChange: (value: OptionGroup[]) => void;
};

export const OptionGroupsSelect: FC<Props> = memo(function ModifiersSelect(
  props
) {
  const { value, onValueChange } = props;
  const { handleDelete, local, itemId } = useOptionGroupsSelect(props);

  function renderGroup() {
    return function (group: OptionGroup, index: number) {
      const toOptionView = withSlug(
        itemId
          ? paths.item(
              itemId,
              paths.modifier(group.id, paths.modifierOptions())
            )
          : paths.itemCreate(paths.modifier(group.id, paths.modifierOptions()))
      );

      return (
        <Draggable
          key={group.id}
          draggableId={group.id!.toString()}
          index={index}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <ItemChip
                key={group.id}
                id={group.id}
                onDelete={handleDelete}
                title={getLabel(group.name, local)}
                toItemsView={toOptionView}
              />
            </div>
          )}
        </Draggable>
      );
    };
  }

  return (
    <>
      {value.length > 0 && (
        <DragDrop
          value={value}
          onValueChange={onValueChange}
          renderItem={renderGroup()}
        />
      )}
    </>
  );
});

function useOptionGroupsSelect({ value, onValueChange }: Props) {
  const { local } = useLocal();
  const params = useParams<{ item?: string }>();
  const itemId = params.item ? toNumber(params.item) : undefined;

  const handleDelete = useCallback(
    (id: number) => {
      const newValue = value?.filter((group) => group.id !== id);
      onValueChange(newValue);
    },
    [onValueChange, value]
  );

  return { handleDelete, local, itemId };
}

/*
import { FC, memo, useCallback } from "react";
import { ItemChip } from "components/ItemChip";
import { paths, withSlug } from "paths";
import { useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { getLabel } from "domain/util/text";
import { useLocal } from "hooks/useLocal";
import { OptionGroup } from "domain/models/OptionGroup";

type Props = {
  value: OptionGroup[];
  onValueChange: (value: OptionGroup[]) => void;
};

export const OptionGroupsSelect: FC<Props> = memo(function ModifiersSelect(
  props
) {
  const { value } = props;
  const { handleDelete, local, itemId } = useOptionGroupsSelect(props);

  function renderGroup() {
    return function (group: OptionGroup) {
      const toOptionView = withSlug(
        itemId
          ? paths.item(
              itemId,
              paths.modifier(group.id, paths.modifierOptions())
            )
          : paths.itemCreate(paths.modifier(group.id, paths.modifierOptions()))
      );

      return (
        <ItemChip
          key={group.id}
          id={group.id}
          onDelete={handleDelete}
          title={getLabel(group.name, local)}
          toItemsView={toOptionView}
        />
      );
    };
  }

  return <>{value?.length > 0 && value.map(renderGroup())}</>;
});

function useOptionGroupsSelect({ value, onValueChange }: Props) {
  const { local } = useLocal();
  const params = useParams<{ item?: string }>();
  const itemId = params.item ? toNumber(params.item) : undefined;

  const handleDelete = useCallback(
    (id: number) => {
      const newValue = value?.filter((group) => group.id !== id);
      onValueChange(newValue);
    },
    [onValueChange, value]
  );

  return { handleDelete, local, itemId };
}

 */
