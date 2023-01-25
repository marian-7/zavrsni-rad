import React, { FC, memo, useCallback, useMemo } from "react";
import { Formik, useFormikContext } from "formik";
import { TagAddForm, TagFormValues } from "pages/tags/component/TagAddForm";
import { mapTranslation } from "domain/util/formik";
import { useOrganization } from "hooks/useOrganization";
import { ItemFormValues } from "components/itemForm/ItemForm";
import { tagSchema } from "domain/util/validators";
import { useMutation, useQueryClient } from "react-query";
import { tagsService } from "domain/services/tagsService";
import { AxiosResponse } from "axios";
import { AccessLevel, Tag } from "domain/models/Tag";
import { useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";

type Props = {
  onTagAdded?: () => void;
};

export const TagAdd: FC<Props> = memo(function TagAdd(props) {
  const { initialValues, handleSubmit, creatingTag } = useTagAdd(props);

  return (
    <Formik<TagFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={tagSchema}
    >
      <TagAddForm creating={creatingTag} />
    </Formik>
  );
});

function useTagAdd({ onTagAdded }: Props) {
  const qc = useQueryClient();
  const { show } = useSnackbar();
  const { t } = useTranslation();
  const organization = useOrganization();
  const { values, setFieldValue } = useFormikContext<ItemFormValues>();
  const params = useParams<{ item: string }>();
  const itemId = toNumber(params.item);

  const initialValues = useMemo(() => {
    const name = mapTranslation(organization?.languages);

    return {
      name: name,
      organizational: false,
    };
  }, [organization?.languages]);

  const handleCreateSuccess = useCallback(
    ({ data: newTag }: AxiosResponse<Tag>) => {
      show(t("snackbar.tagCreated"));
      qc.setQueryData<Tag[]>(["tags", itemId], (old) => {
        return old?.concat([newTag]) ?? [];
      });
      const tags = (values?.tags ?? []).concat([newTag]);
      setFieldValue("tags", tags);
      onTagAdded?.();
    },
    [itemId, onTagAdded, qc, setFieldValue, show, t, values.tags]
  );

  const { mutateAsync: createTag, isLoading: creatingTag } = useMutation(
    (data: TagFormValues) => {
      return tagsService.createTag(data);
    },
    {
      onSuccess: handleCreateSuccess,
    }
  );

  const handleSubmit = useCallback(
    ({ name, organizational }: TagFormValues) => {
      const data = {
        name,
        accessLevel: organizational
          ? AccessLevel.Organization
          : AccessLevel.Item,
      };
      return createTag(data).catch(() => {});
    },
    [createTag]
  );

  const handleDelete = useCallback(() => {}, []);

  return { initialValues, handleSubmit, handleDelete, creatingTag };
}
