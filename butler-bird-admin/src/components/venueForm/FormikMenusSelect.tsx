import React, { FC, memo, useCallback } from "react";
import { Menu } from "domain/models/Menu";
import { ChipsSelect, ChipsSelectProps } from "components/ChipsSelect";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import { useTranslation } from "react-i18next";
import { useField } from "formik";
import { keyBy } from "lodash";
import { MenuChip } from "components/venueForm/MenuChip";
import { Draggable } from "react-beautiful-dnd";
import { DragDrop } from "components/DragDrop";
import dragDropStyle from "styles/components/DragDrop.module.scss";

interface Props extends ChipsSelectProps {
  name: string;
  menus: Menu[];
  addMenusTo: string;
  viewPath: (menu: number) => string;
}

export const FormikMenusSelect: FC<Props> = memo(function FormikMenusSelect(
  props
) {
  const { addMenusTo, viewPath, ...rest } = props;
  const { chips, handleDelete, handleValueChange } = useFormikMenusSelect(
    props
  );
  const { t } = useTranslation();

  function renderMenu(menu: Menu, index: number) {
    return (
      <Draggable key={menu.id} draggableId={menu.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <MenuChip
              key={menu.id}
              menu={menu}
              onDelete={handleDelete}
              viewPath={viewPath(menu.id)}
            />
          </div>
        )}
      </Draggable>
    );
  }

  return (
    <ChipsSelect
      label={t("form.labels.menusSelect")}
      action={{
        label: t("buttons.addMoreMenus"),
        icon: <AddIcon />,
        to: addMenusTo,
      }}
      {...rest}
    >
      <DragDrop
        value={chips}
        onValueChange={handleValueChange}
        renderItem={renderMenu}
        className={dragDropStyle.menusSelect}
      />
    </ChipsSelect>
  );
});

function useFormikMenusSelect({ name, menus }: Props) {
  const [{ value }, , { setValue }] = useField<number[] | undefined>(name);

  const menusRecord = keyBy(menus, "id");
  const chips = value?.map((id) => menusRecord[id]).filter((id) => !!id) ?? [];

  const handleValueChange = useCallback(
    (menus: Menu[]) => {
      setValue(menus.map((menu) => menu.id));
    },
    [setValue]
  );

  function handleDelete(id: number) {
    setValue(value?.filter((vId) => vId !== id));
  }

  return { chips, handleDelete, value, handleValueChange };
}
