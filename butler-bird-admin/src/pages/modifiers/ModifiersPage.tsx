import { toNumber, uniqBy } from "lodash";
import React, { FC, memo, useState } from "react";
import { useParams } from "react-router-dom";
import { SidePage } from "components/SidePage";
import { useTranslation } from "react-i18next";
import { paths, withSlug } from "paths";
import { ModifiersPickerItem } from "pages/modifiers/components/ModifiersPickerItem";
import style from "styles/pages/modifiers/ModifiersPage.module.scss";
import { ReactComponent as AddItem } from "assets/icons/add.svg";
import { LinkButton } from "components/LinkButton";
import { useField } from "formik";
import { OptionGroup } from "domain/models/OptionGroup";
import { useOptionGroups } from "hooks/useOptionGroups";
import { useOrganization } from "hooks/useOrganization";
import { getLabel } from "domain/util/text";

interface Props {}

export const ModifiersPage: FC<Props> = memo(function ModifiersPage() {
  const {
    search,
    setSearch,
    backTo,
    addTo,
    itemId,
    optionGroups,
    handleDelete,
    handleAdd,
  } = useModifiersPage();
  const { t } = useTranslation();

  function renderItem(modifier: OptionGroup & { hasItem: boolean }) {
    const to = withSlug(
      itemId
        ? paths.item(
            itemId,
            paths.modifier(modifier.id, paths.modifierOptions())
          )
        : paths.itemCreate(paths.modifier(modifier.id, paths.modifierOptions()))
    );
    return (
      <ModifiersPickerItem
        key={modifier.id}
        modifier={modifier}
        to={to}
        onAddClick={handleAdd}
        onRemoveClick={handleDelete}
      />
    );
  }

  return (
    <SidePage
      to={backTo}
      onSearchChange={setSearch}
      search={search}
      title={t("pages.modifiers.title")}
    >
      {optionGroups?.map(renderItem)}
      <LinkButton
        to={addTo}
        color="primary"
        variant="text"
        className={style.button}
        startIcon={<AddItem />}
      >
        {t("pages.modifiers.add")}
      </LinkButton>
    </SidePage>
  );
});

function useModifiersPage() {
  const params = useParams<{ item?: string }>();
  const itemId = params.item ? toNumber(params.item) : undefined;
  const organization = useOrganization();
  const [search, setSearch] = useState("");
  const { data: globalOptionGroups } = useOptionGroups();
  const [
    { value: itemOptionGroups },
    ,
    { setValue: setOptionGroups },
  ] = useField<OptionGroup[]>("optionGroups");

  const optionGroups = uniqBy(
    globalOptionGroups?.concat(itemOptionGroups),
    "id"
  )
    .map((og) => {
      const hasItem =
        (itemOptionGroups?.findIndex((iog) => iog.id === og.id) ?? -1) !== -1;
      return { ...og, hasItem };
    })
    .filter((group) => {
      if (!organization) {
        return false;
      }
      const name = getLabel(group.name, organization?.languages);
      return name.toLowerCase().includes(search.toLowerCase());
    });

  const backTo = itemId
    ? withSlug(paths.item(itemId))
    : withSlug(paths.itemCreate());

  const addTo = itemId
    ? withSlug(paths.item(itemId, paths.modifierCreate()))
    : withSlug(paths.itemCreate(paths.modifierCreate()));

  function handleAdd(option: OptionGroup & { hasItem: boolean }) {
    setOptionGroups(itemOptionGroups?.concat([option]));
  }

  function handleDelete(option: OptionGroup) {
    setOptionGroups(itemOptionGroups?.filter((og) => og.id !== option.id));
  }

  return {
    search,
    setSearch,
    backTo,
    addTo,
    itemId,
    optionGroups,
    handleAdd,
    handleDelete,
  };
}
