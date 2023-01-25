import { FC, memo, useCallback, useMemo } from "react";
import { Formik } from "formik";
import { CategoryForm, CategoryFormValues } from "components/CategoryForm";
import { useMutation, useQueryClient } from "react-query";
import { categoriesService } from "domain/services/categoriesService";
import { useHistory, useParams } from "react-router-dom";
import { paths } from "paths";
import { AxiosResponse } from "axios";
import { Category } from "domain/models/Category";
import { useOrganization } from "hooks/useOrganization";
import { categorySchema } from "domain/util/validators";
import { mapTranslation } from "domain/util/formik";
import { nextTick } from "util/nextTick";

type Props = {};

export const CategoryCreatePage: FC<Props> = memo(function CategoryCreate() {
  const { initialValues, handleSubmit, toItemPicker } = useCategoryCreatePage();

  return (
    <Formik<CategoryFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={categorySchema}
      enableReinitialize
    >
      <CategoryForm toItemPicker={toItemPicker} />
    </Formik>
  );
});

function useCategoryCreatePage() {
  const queryClient = useQueryClient();
  const { replace } = useHistory();
  const { slug } = useParams<{ slug: string }>();
  const organization = useOrganization();

  const initialValues = useMemo(() => {
    const typography = mapTranslation(organization?.languages);

    return {
      name: typography,
      description: typography,
      items: [],
      image: undefined,
    };
  }, [organization?.languages]);

  const handleSuccess = useCallback(
    ({ data: category }: AxiosResponse<Category>) => {
      queryClient.setQueryData<Category[]>("categories", (old) => {
        return [...(old ?? []), category];
      });

      nextTick(() => replace(paths.category(category.id, slug)));
    },
    [queryClient, replace, slug]
  );

  const { mutateAsync: createCategory } = useMutation(
    (values: CategoryFormValues) => {
      const { image, ...rest } = values;
      if (image instanceof File) {
        return categoriesService.createCategory(rest, image);
      }
      return categoriesService.createCategory({ ...rest, image });
    },
    {
      onSuccess: handleSuccess,
    }
  );

  const handleSubmit = useCallback(
    (values: CategoryFormValues) => {
      return createCategory(values);
    },
    [createCategory]
  );

  const toItemPicker = paths.createItemsPicker(slug);

  return {
    initialValues,
    handleSubmit,
    toItemPicker,
  };
}
