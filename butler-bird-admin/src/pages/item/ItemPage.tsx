import { ItemForm, ItemFormValues } from "components/itemForm/ItemForm";
import { Formik } from "formik";
import React, { FC, memo, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import { isEqual, toNumber } from "lodash";
import { itemsService } from "domain/services/itemsService";
import { mapData } from "domain/util/axios";
import { Item } from "domain/models/Item";
import { itemSchema } from "domain/util/validators";
import { useOrganization } from "hooks/useOrganization";
import { paths, withSlug } from "paths";
import { tagsService } from "domain/services/tagsService";
import { useItemUpdate } from "hooks/useItemUpdate";
import { useDeleteItem } from "hooks/useDeleteItem";
import { mapTranslation } from "domain/util/formik";

interface Props {}

export const ItemPage: FC<Props> = memo(function ItemPage() {
  const {
    item,
    initialValues,
    handleItemDelete,
    toTagsPicker,
    toOptionGroupsPicker,
    handleSubmit,
    isDeleting,
    isSubmitting,
  } = useItemPage();

  return (
    <Formik<ItemFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={itemSchema}
      enableReinitialize
    >
      <ItemForm
        item={item}
        isSubmitting={isSubmitting}
        onItemDelete={handleItemDelete}
        toOptionGroupsPicker={toOptionGroupsPicker}
        toTagsPicker={toTagsPicker}
        isDeleting={isDeleting}
      />
    </Formik>
  );
});

function useItemPage() {
  const qc = useQueryClient();
  const history = useHistory();
  const params = useParams<{
    slug: string;
    item: string;
  }>();
  const id = toNumber(params.item);
  const organization = useOrganization();

  const { data: item } = useQuery(
    ["items", id],
    ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? itemsService.getItem(id).then(mapData) : undefined;
    },
    {
      enabled: !!id,
      placeholderData: () =>
        qc.getQueryData<Item[]>("items")?.find((i) => i.id === id),
    }
  );

  const { data: tags } = useQuery(["tags", id], ({ queryKey }) => {
    const [, id] = queryKey;
    return id ? tagsService.getTags(id).then(mapData) : undefined;
  });

  const containedTags = useMemo(
    () => (item && tags?.filter((t) => item?.tags.includes(t.id))) ?? [],
    [item, tags]
  );

  const initialValues = useMemo(() => {
    const languages = organization?.languages;
    const name = mapTranslation(languages, item?.name);
    const description = mapTranslation(languages, item?.description);
    const longDescription = mapTranslation(languages, item?.longDescription);

    return {
      name: name,
      description: description,
      longDescription: longDescription,
      price: item?.price.toFixed(2),
      optionGroups: item?.optionGroups ?? [],
      tags: containedTags,
      image: item?.image,
    };
  }, [
    containedTags,
    item?.description,
    item?.longDescription,
    item?.image,
    item?.name,
    item?.optionGroups,
    item?.price,
    organization?.languages,
  ]);

  const handleMutate = useCallback(() => {
    history.replace(withSlug(paths.items()));
    return undefined;
  }, [history]);

  const { mutateAsync: deleteItem, isLoading: isDeleting } = useDeleteItem({
    onMutate: handleMutate,
  });
  const handleItemDelete = useCallback(() => {
    if (id) {
      return deleteItem(id).catch(() => {});
    }
  }, [deleteItem, id]);

  const { mutateAsync: addTags } = useMutation(itemsService.addTags);

  const { mutateAsync: updateItem, isLoading: isSubmitting } = useItemUpdate();
  const handleSubmit = useCallback(
    (values: ItemFormValues) => {
      if (id) {
        const {
          tags: tagObjects,
          price: basePrice,
          optionGroups: oGs,
          image,
          ...rest
        } = values;
        const tags = tagObjects?.map((t) => t.id) ?? [];
        const price = toNumber(basePrice);
        const optionGroups = oGs.map((group) => {
          const { id, isNew, options: groupOptions, ...groupData } = group;

          const options = groupOptions.map((o) => {
            if (o.isNew) {
              const { id, isNew, ...rest } = o;
              return rest;
            }
            return o;
          });

          return isNew
            ? { ...groupData, options: options }
            : { ...groupData, id: id, options: options };
        });

        const itemData = {
          ...rest,
          price,
          optionGroups,
          id,
        };

        if (image instanceof File) {
          updateItem({ data: itemData, image: image }).catch(() => {});
        } else {
          updateItem({ data: { ...itemData, image } }).catch(() => {});
        }
        if (!isEqual(item?.tags, tags)) {
          addTags({ id, tags }).catch(() => {});
        }
      }
    },
    [addTags, id, item?.tags, updateItem]
  );

  const toOptionGroupsPicker = withSlug(paths.item(id, paths.modifiers()));
  const toTagsPicker = withSlug(paths.item(id, paths.tags()));

  return {
    item,
    initialValues,
    handleItemDelete,
    toTagsPicker,
    toOptionGroupsPicker,
    handleSubmit,
    isDeleting,
    isSubmitting,
  };
}
