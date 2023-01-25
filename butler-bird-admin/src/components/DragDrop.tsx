import React, { FC, memo, useCallback } from "react";
import {
  Direction,
  DragDropContext,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import style from "styles/components/DragDrop.module.scss";
import classNames from "classnames";

type Props = {
  value: any[];
  onValueChange: (value: any[]) => void;
  renderItem: (value: any, index: number) => JSX.Element;
  className?: string;
  direction?: Direction;
};

export const DragDrop: FC<Props> = memo(function DragDrop(props) {
  const { value, renderItem, className, direction = "horizontal" } = props;
  const { handleDragEnd } = useDragDrop(props);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable" direction={direction}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            className={classNames(style.droppable, className)}
            {...provided.droppableProps}
          >
            {value?.map(renderItem)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

function useDragDrop({ value, onValueChange }: Props) {
  const reorder = useCallback(
    (array: number[], startIndex: number, endIndex: number) => {
      const newArray = [...array];
      const [removed] = newArray.splice(startIndex, 1);
      newArray.splice(endIndex, 0, removed);
      return newArray;
    },
    []
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      if (result.destination.index === result.source.index) {
        return;
      }

      const orderedList = reorder(
        value,
        result.source.index,
        result.destination.index
      );
      onValueChange(orderedList);
    },
    [onValueChange, reorder, value]
  );

  return { handleDragEnd };
}
