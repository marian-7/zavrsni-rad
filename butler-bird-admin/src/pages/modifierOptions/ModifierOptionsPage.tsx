import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { SidePage } from "components/SidePage";
import { useTranslation } from "react-i18next";
import { paths, withSlug } from "paths";
import { useHistory, useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { ReactComponent as BackIcon } from "assets/icons/arrow-back.svg";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import style from "styles/pages/modifierOptions/components/ModifiersOptionForm.module.scss";
import { Button } from "components/Button";
import { ModifierOptionListItem } from "./components/ModifierOptionListItem";
import { useField } from "formik";
import { ModifierOptionAdd } from "pages/modifierOptions/components/ModifierOptionAdd";
import { Option, OptionGroup } from "domain/models/OptionGroup";
import { DragDrop } from "components/DragDrop";
import { Draggable } from "react-beautiful-dnd";
import { useMutation } from "react-query";
import {
  optionGroupsService,
  UpdateOptionGroupData,
} from "domain/services/optionGroupsService";
import { mapData } from "domain/util/axios";

type Props = {
  addFormOpened?: boolean;
};

export const ModifierOptionsPage: FC<Props> = memo(function ModifierItems(
  props
) {
  const {
    t,
    backTo,
    handleBackClick,
    addOpened,
    handleAddMore,
    handleSaveOption,
    modifierOptions,
    itemId,
    modifierId,
    handleOptionReorder,
  } = useModifierItemsPage(props);

  function renderOption(option: Option, index: number) {
    const to = withSlug(
      itemId
        ? paths.item(
            itemId,
            paths.modifier(modifierId, paths.modifierOption(option.id))
          )
        : paths.itemCreate(
            paths.modifier(modifierId, paths.modifierOption(option.id))
          )
    );

    return (
      <Draggable
        key={option.id}
        draggableId={option.id!.toString()}
        index={index}
      >
        {(provided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <ModifierOptionListItem key={option.id} option={option} to={to} />
            </div>
          );
        }}
      </Draggable>
    );
  }

  return (
    <SidePage
      title={t("pages.modifierItems.title")}
      to={backTo}
      startIcon={<BackIcon />}
      onStartIconClick={handleBackClick}
    >
      <DragDrop
        className={style.dndContainer}
        direction="vertical"
        value={modifierOptions ?? []}
        onValueChange={handleOptionReorder}
        renderItem={renderOption}
      />
      {addOpened ? (
        <ModifierOptionAdd onOptionAdded={handleSaveOption} />
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddMore}
          rootClassName={style.btnSaveItem}
        >
          {t("pages.modifierItems.addMore")}
        </Button>
      )}
    </SidePage>
  );
});

function useModifierItemsPage({ addFormOpened }: Props) {
  const history = useHistory();
  const { t } = useTranslation();
  const params = useParams<{
    item?: string;
    modifier: string;
  }>();
  const itemId = params.item ? toNumber(params.item) : undefined;
  const modifierId = toNumber(params.modifier);
  const [addOpened, setOpenAdd] = useState(addFormOpened);
  const { mutateAsync } = useMutation<
    OptionGroup,
    unknown,
    UpdateOptionGroupData
  >((d) => optionGroupsService.update(d).then(mapData));

  const [{ value: optionGroups }, , { setValue: setOptionGroups }] = useField<
    OptionGroup[]
  >("optionGroups");

  const currentModifier = useMemo(() => {
    return modifierId
      ? optionGroups.find((m) => m.id === modifierId)
      : optionGroups?.slice(-1)[0];
  }, [modifierId, optionGroups]);

  const modifierOptions = useMemo(() => {
    if (currentModifier?.id) {
      return optionGroups?.find((g) => g.id === currentModifier?.id)?.options;
    }
  }, [currentModifier?.id, optionGroups]);

  const handleSaveOption = useCallback(() => {
    setOpenAdd(false);
  }, []);

  const handleAddMore = useCallback(() => {
    setOpenAdd(true);
  }, []);

  const backTo = itemId
    ? withSlug(paths.item(itemId))
    : withSlug(paths.itemCreate());

  const handleBackClick = useCallback(() => {
    if (itemId && modifierId) {
      history.goBack();
    } else if (!itemId && !modifierId) {
      history.replace(withSlug(paths.itemCreate(paths.modifierCreate())), {
        modifierState: currentModifier,
      });
    } else if (itemId && !modifierId) {
      history.replace(withSlug(paths.item(itemId, paths.modifierCreate())), {
        modifierState: currentModifier,
      });
    }
  }, [currentModifier, history, itemId, modifierId]);

  function handleOptionReorder(options: Option[]) {
    setOptionGroups(
      optionGroups.map((og) => {
        if (og.id !== modifierId) {
          return og;
        }
        return { ...og, options };
      })
    );
    return mutateAsync({ id: modifierId, options });
  }

  return {
    t,
    backTo,
    addOpened,
    handleSaveOption,
    handleAddMore,
    modifierOptions,
    itemId,
    modifierId,
    handleBackClick,
    handleOptionReorder,
  };
}
