import { useMutation, useQueryClient } from "react-query";
import {
  categoriesService,
  UpdateCategoryData,
} from "../domain/services/categoriesService";
import { Category } from "../domain/models/Category";

interface OnError {
  (): void;
}

interface OnMutate {
  (data: UpdateCategoryData): void | OnError;
}

export function useCategoryUpdate(onMutate?: OnMutate) {
  const qc = useQueryClient();

  return useMutation<
    unknown,
    unknown,
    UpdateCategoryData,
    { categories?: Category[]; category?: Category; onError?: OnError | void }
  >(categoriesService.updateCategory, {
    onMutate: (data) => {
      let categories: Category[] | undefined;
      let category: Category | undefined;

      qc.setQueryData<Category | undefined>(["categories", data.id], (old) => {
        category = old;
        if (!old) {
          return old;
        }
        return { ...old, ...data };
      });
      qc.setQueryData<Category[] | undefined>("categories", (old) => {
        categories = old;
        return old?.map((category) =>
          category.id === data.id ? { ...category, ...data } : category
        );
      });

      const onError = onMutate?.(data);

      return { categories, category, onError };
    },
    onError: (err, data, context) => {
      qc.setQueryData<Category | undefined>(
        ["categories", data.id],
        context?.category
      );
      qc.setQueryData<Category[] | undefined>(
        "categories",
        context?.categories
      );

      if (context?.onError) {
        context.onError();
      }
    },
  });
}
