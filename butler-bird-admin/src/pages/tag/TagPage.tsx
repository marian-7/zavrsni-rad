import React, { FC, memo, useCallback, useMemo } from "react";
import { SidePage } from "components/SidePage";
import { ReactComponent as BackIcon } from "assets/icons/arrow-back.svg";
import { useHistory, useParams } from "react-router-dom";
import { toNumber } from "lodash";
import { paths, withSlug } from "paths";
import { TagAddForm, TagFormValues } from "pages/tags/component/TagAddForm";
import { Formik, useFormikContext } from "formik";
import { mapTranslation } from "domain/util/formik";
import { useOrganization } from "hooks/useOrganization";
import { tagSchema } from "domain/util/validators";
import { ItemFormValues } from "components/itemForm/ItemForm";
import { useMutation, useQueryClient } from "react-query";
import { AccessLevel, Tag } from "domain/models/Tag";
import { tagsService } from "domain/services/tagsService";
import { AxiosResponse } from "axios";
import { useSnackbar } from "hooks/useSnackbar";
import { useTranslation } from "react-i18next";

type Props = {};

export const TagPage: FC<Props> = memo(function TagPage() {
  const {
    t,
    backTo,
    handleStartIconClick,
    handleSubmit,
    initialValues,
    updatingTag,
    handleDelete,
    deletingTag,
    globalTag,
  } = useTagPage();

  return (
    <SidePage
      title={t("pages.tag.title")}
      to={backTo}
      startIcon={<BackIcon />}
      onStartIconClick={handleStartIconClick}
    >
      <Formik<TagFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={tagSchema}
        enableReinitialize
      >
        <TagAddForm
          editable
          disabled={globalTag}
          updating={updatingTag}
          deleting={deletingTag}
          onDelete={handleDelete}
        />
      </Formik>
    </SidePage>
  );
});

function useTagPage() {
  const qc = useQueryClient();
  const { goBack } = useHistory();
  const { t } = useTranslation();
  const organization = useOrganization();
  const params = useParams<{
    item: string;
    tag: string;
  }>();
  const itemId = toNumber(params.item);
  const tagId = toNumber(params.tag);
  const { values, setFieldValue } = useFormikContext<ItemFormValues>();
  const { show } = useSnackbar();

  const tag = qc
    .getQueryData<Tag[]>(["tags", itemId])
    ?.find((t) => t.id === tagId);

  const globalTag = tag?.accessLevel === AccessLevel.Global;
  const initialValues = useMemo(() => {
    const name = mapTranslation(organization?.languages, tag?.name);
    return {
      name: name,
      organizational:
        globalTag || tag?.accessLevel === AccessLevel.Organization,
    };
  }, [globalTag, organization?.languages, tag?.accessLevel, tag?.name]);

  const handleUpdateSuccess = useCallback(
    ({ data: updateTag }: AxiosResponse<Tag>) => {
      show(t("snackbar.tagUpdated"));
      qc.setQueryData<Tag[]>(["tags", itemId], (old) => {
        return old?.map((t) => (t.id === updateTag.id ? updateTag : t)) ?? [];
      });
      setFieldValue(
        "tags",
        values.tags?.map((t) => (t.id === updateTag.id ? updateTag : t))
      );
      goBack();
    },
    [goBack, itemId, qc, setFieldValue, show, t, values.tags]
  );

  const { mutateAsync: updateTag, isLoading: updatingTag } = useMutation(
    tagsService.updateTag,
    {
      onSuccess: handleUpdateSuccess,
    }
  );

  const handleSubmit = useCallback(
    ({ name, organizational }: TagFormValues) => {
      const data = {
        id: tagId,
        name,
        accessLevel: organizational
          ? AccessLevel.Organization
          : AccessLevel.Item,
      };
      return updateTag(data).catch(() => {});
    },
    [tagId, updateTag]
  );

  const handleDeleteSuccess = useCallback(
    ({ data: deletedTag }: AxiosResponse<Tag>) => {
      show(t("snackbar.tagDeleted"));
      qc.setQueryData<Tag[]>(["tags", itemId], (old) => {
        return old?.filter((t) => t.id !== deletedTag.id) ?? [];
      });
      setFieldValue(
        "tags",
        values.tags?.filter((t) => t.id !== deletedTag.id)
      );
      goBack();
    },
    [goBack, itemId, qc, setFieldValue, show, t, values.tags]
  );

  const { mutateAsync: deleteTag, isLoading: deletingTag } = useMutation(
    tagsService.deleteTag,
    {
      onSuccess: handleDeleteSuccess,
    }
  );

  const handleDelete = useCallback(() => {
    return deleteTag(tagId).catch(() => {});
  }, [deleteTag, tagId]);

  const backTo = itemId
    ? withSlug(paths.item(itemId))
    : withSlug(paths.itemCreate());

  const handleStartIconClick = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    t,
    backTo,
    handleStartIconClick,
    initialValues,
    handleSubmit,
    updatingTag,
    handleDelete,
    deletingTag,
    globalTag,
  };
}
