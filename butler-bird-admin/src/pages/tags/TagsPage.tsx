import React, { FC, memo, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { SidePage } from "components/SidePage";
import { useTranslation } from "react-i18next";
import { paths, withSlug } from "paths";
import { Tag } from "domain/models/Tag";
import { useQuery, useQueryClient } from "react-query";
import { mapData } from "domain/util/axios";
import { tagsService } from "domain/services/tagsService";
import { TagsPickerItem } from "pages/tags/component/TagsPickerItem";
import { findIndex, isNil, toNumber } from "lodash";
import { Item } from "domain/models/Item";
import { useLocal } from "hooks/useLocal";
import { getLabel } from "domain/util/text";
import { TagAdd } from "pages/tags/component/TagAdd";
import { Button } from "components/Button";
import { ReactComponent as AddIcon } from "assets/icons/add.svg";
import style from "styles/pages/tags/components/TagAddForm.module.scss";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { ItemFormValues } from "components/itemForm/ItemForm";
import { useToggleState } from "hooks/useToggleState";

type Props = {};

export const TagsPage: FC<Props> = memo(function AllergensPage() {
  const {
    search,
    setSearch,
    to,
    selectedTags,
    filteredTags,
    handleItemClick,
    item,
    itemId,
    addOpened,
    toggleAdd,
  } = useTagsPage();
  const { t } = useTranslation();

  function renderItem(tag: Tag) {
    const added = findIndex(selectedTags, { id: tag.id }) !== -1;
    const to = withSlug(
      itemId
        ? paths.item(itemId, paths.tag(tag.id))
        : paths.itemCreate(paths.tag(tag.id))
    );
    return (
      <TagsPickerItem
        added={added}
        key={tag.id}
        tag={tag}
        onClick={handleItemClick}
        to={to}
      />
    );
  }

  return (
    <SidePage
      to={to}
      onSearchChange={setSearch}
      search={search}
      title={t("pages.tags.title")}
    >
      {(item || isNil(itemId)) && filteredTags?.map(renderItem)}
      {addOpened ? (
        <TagAdd onTagAdded={toggleAdd} />
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={toggleAdd}
          rootClassName={classNames(style.btn, style.btnSaveTag)}
        >
          {t("pages.tags.addNew")}
        </Button>
      )}
    </SidePage>
  );
});

function useTagsPage() {
  const qc = useQueryClient();
  const params = useParams<{ item?: string }>();
  const itemId = params?.item ? toNumber(params.item) : undefined;
  const { local } = useLocal();
  const [addOpened, toggleAdd] = useToggleState(false, [true, false]);
  const [search, setSearch] = useState("");
  const { values, setFieldValue } = useFormikContext<ItemFormValues>();
  const { tags: selectedTags } = values;

  const { data: tags } = useQuery(["tags", itemId], ({ queryKey }) => {
    const [, itemId] = queryKey;
    return (
      qc.getQueryData(queryKey) ?? tagsService.getTags(itemId).then(mapData)
    );
  });
  const { data: item } = useQuery(
    ["items", itemId],
    ({ queryKey }) => qc.getQueryData(queryKey),
    {
      enabled: !!itemId,
      placeholderData: () =>
        qc.getQueryData<Item[]>("items")?.find((item) => item.id === itemId),
    }
  );

  const to = withSlug(itemId ? paths.item(itemId) : paths.itemCreate());
  const filteredTags = tags?.filter((tag) => {
    return getLabel(tag.name, local)
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const handleTagsChange = useCallback(
    (tags: Tag[]) => {
      setFieldValue("tags", tags);
    },
    [setFieldValue]
  );

  function handleItemClick(tag: Tag) {
    const list = selectedTags?.filter((sTag) => sTag.id !== tag.id) ?? [];
    if (list.length !== selectedTags?.length) {
      handleTagsChange(list);
    } else {
      handleTagsChange(list.concat([tag]));
    }
  }

  return {
    search,
    setSearch,
    to,
    selectedTags,
    filteredTags,
    handleItemClick,
    item,
    itemId,
    addOpened,
    toggleAdd,
  };
}
