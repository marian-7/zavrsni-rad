import React, { FC, memo, useCallback, useMemo } from "react";
import { Formik } from "formik";
import { CategoryForm, CategoryFormValues } from "components/CategoryForm";
import { useHistory, useParams } from "react-router-dom";
import { paths } from "paths";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { categoriesService } from "domain/services/categoriesService";
import { useOrganization } from "hooks/useOrganization";
import { AxiosResponse } from "axios";
import { Category } from "domain/models/Category";
import { categorySchema } from "domain/util/validators";
import { toNumber } from "lodash";
import { mapData } from "domain/util/axios";
import { mapTranslation } from "domain/util/formik";
import { nextTick } from "util/nextTick";

type Props = {};

export const CategoryPage: FC<Props> = memo(function CategoryPage() {
  const {
    handleSubmit,
    initialValues,
    category,
    toItemPicker,
    handleCategoryDelete,
    isDeleting,
  } = useCategoryPage();

  return (
    <Formik<CategoryFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={categorySchema}
      enableReinitialize
    >
      <CategoryForm
        category={category}
        toItemPicker={toItemPicker}
        onCategoryDelete={handleCategoryDelete}
        deleting={isDeleting}
      />
    </Formik>
  );
});

function useCategoryPage() {
  const queryClient = useQueryClient();
  const { replace } = useHistory();
  const params = useParams<{ slug: string; id?: string }>();
  const { slug } = params;
  const id = params.id ? toNumber(params.id) : undefined;
  const organization = useOrganization();

  const { data: category } = useQuery(
    ["categories", id],
    ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? categoriesService.getCategory(id).then(mapData) : undefined;
    },
    {
      enabled: !!id,
      placeholderData: () =>
        queryClient
          .getQueryData<Category[]>("categories")
          ?.find((c) => c.id === id),
    }
  );

  const initialValues = useMemo(() => {
    const languages = organization?.languages;
    const name = mapTranslation(languages, category?.name);
    const description = mapTranslation(languages, category?.description);

    return {
      name: name,
      description: description,
      items: category?.items,
      image: category?.image,
    };
  }, [
    category?.description,
    category?.image,
    category?.items,
    category?.name,
    organization?.languages,
  ]);

  const handleUpdateSuccess = useCallback(
    ({ data: category }: AxiosResponse<Category>) => {
      queryClient.setQueryData<Category>(
        ["categories", category.id],
        () => category
      );

      queryClient.setQueryData<Category[]>("categories", (old) => {
        return (
          old?.map((c) => {
            if (c.id === category.id) {
              return category;
            }
            return c;
          }) ?? []
        );
      });
    },
    [queryClient]
  );

  const { mutateAsync: updateCategory } = useMutation(
    (values: CategoryFormValues & { id: number }) => {
      const { image, ...rest } = values;
      if (image instanceof File) {
        return categoriesService.updateCategory(rest, image);
      }
      return categoriesService.updateCategory({ ...rest, image });
    },
    { onSuccess: handleUpdateSuccess }
  );

  const handleSubmit = useCallback(
    (values: CategoryFormValues) => {
      if (id) {
        const val = { ...values, id };
        return updateCategory(val);
      }
    },
    [id, updateCategory]
  );

  const handleDeleteSuccess = useCallback(
    ({ data: category }: AxiosResponse<Category>) => {
      queryClient.setQueryData<Category[]>("categories", (old) => {
        return old?.filter((c) => c.id !== category.id) ?? [];
      });
      nextTick(() => replace(paths.categories(slug)));
    },
    [queryClient, replace, slug]
  );

  const { mutateAsync: deleteCategory, isLoading: isDeleting } = useMutation(
    categoriesService.deleteCategory,
    {
      onSuccess: handleDeleteSuccess,
    }
  );

  const handleCategoryDelete = useCallback(() => {
    if (id) {
      return deleteCategory(id);
    }
  }, [deleteCategory, id]);

  const toItemPicker = paths.itemsPicker(id, slug);

  return {
    handleSubmit,
    initialValues,
    category,
    toItemPicker,
    handleCategoryDelete,
    isDeleting,
  };
}
