import React, { FC, memo, useCallback, useMemo, useRef } from "react";
import { ItemForm, ItemFormValues } from "components/itemForm/ItemForm";
import { Formik, FormikProps } from "formik";
import { useOrganization } from "hooks/useOrganization";
import { paths, withSlug } from "paths";
import { itemSchema } from "domain/util/validators";
import { toNumber } from "lodash";
import { useCreateItem } from "hooks/useCreateItem";
import { Item } from "domain/models/Item";
import { useHistory } from "react-router-dom";
import { mapTranslation } from "domain/util/formik";
import { useMutation, useQueryClient } from "react-query";
import { itemsService } from "domain/services/itemsService";
import { AxiosResponse } from "axios";
import { handleItemUpdateSuccess } from "hooks/useItemUpdate";
import { nextTick } from "util/nextTick";

interface Props {}

export const ItemCreatePage: FC<Props> = memo(function ItemCreatePage() {
  const {
    handleSubmit,
    initialValues,
    toTagsPicker,
    toOptionGroupsPicker,
    isSubmitting,
    addingTags,
    formik,
  } = useItemCreatePage();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={itemSchema}
      enableReinitialize
      innerRef={formik}
    >
      <ItemForm
        isSubmitting={isSubmitting || addingTags}
        toOptionGroupsPicker={toOptionGroupsPicker}
        toTagsPicker={toTagsPicker}
      />
    </Formik>
  );
});

function useItemCreatePage() {
  const { replace } = useHistory();
  const organization = useOrganization();
  const formik = useRef<FormikProps<ItemFormValues>>(null);
  const qc = useQueryClient();

  const initialValues = useMemo(() => {
    const typography = mapTranslation(organization?.languages);

    return {
      name: typography,
      description: typography,
      longDescription: typography,
      price: undefined,
      optionGroups: [],
      allergens: [],
      image: undefined,
    };
  }, [organization?.languages]);

  const handleAddTagsSuccess = useCallback(
    ({ data: item }: AxiosResponse<Item>) => {
      handleItemUpdateSuccess(item, qc);
    },
    [qc]
  );

  const { mutateAsync: addTags, isLoading: addingTags } = useMutation(
    itemsService.addTags,
    {
      onSuccess: handleAddTagsSuccess,
    }
  );

  const handleCreateSuccess = useCallback(
    (item: Item) => {
      const tags = formik?.current?.values.tags?.map((tag) => tag.id) ?? [];
      if (tags?.length > 0) {
        addTags({ id: item.id, tags }).catch(() => {});
      }
      nextTick(() => replace(withSlug(paths.item(item.id))));
    },
    [addTags, replace]
  );

  const { mutateAsync: createItem, isLoading: isSubmitting } = useCreateItem({
    onSuccess: handleCreateSuccess,
  });

  const handleSubmit = useCallback(
    (values: ItemFormValues) => {
      const {
        tags: tagIds,
        price: basePrice,
        optionGroups: oGs,
        image,
        ...rest
      } = values;
      const price = toNumber(basePrice);

      const optionGroups = oGs.map((group) => {
        if (group?.isNew) {
          const {
            id: groupId,
            isNew: groupIsNew,
            options: groupOptions,
            ...rest
          } = group;
          const options = groupOptions.map((o) => {
            if (o.isNew) {
              const { id, isNew, ...rest } = o;
              return rest;
            }
            return o;
          });
          return { ...rest, options: options };
        }
        return group;
      });

      const itemData = { ...rest, price, optionGroups };

      if (image instanceof File) {
        return createItem({ data: itemData, image });
      }
      return createItem({ data: itemData });
    },
    [createItem]
  );

  const toOptionGroupsPicker = withSlug(paths.itemCreate(paths.modifiers()));
  const toTagsPicker = withSlug(paths.itemCreate(paths.tags()));

  return {
    handleSubmit,
    initialValues,
    toTagsPicker,
    toOptionGroupsPicker,
    isSubmitting,
    formik,
    addingTags,
  };
}
