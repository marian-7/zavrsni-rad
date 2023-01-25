import React, { ChangeEvent, FC, memo, useCallback, useState } from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import style from "styles/components/tags-filter.module.scss";
import { Checkbox } from "./Checkbox";
import { Dialog } from "./Dialog";
import { Tag } from "domain/types/Tag";
import { useRouter } from "next/router";
import { useMenu } from "hooks/useMenu";
import { getLabel } from "domain/util/text";
import { MenuModal } from "providers/MenuProvider";
import { Button } from "components/Button";

type Props = {};

export const TagsFilterDialog: FC<Props> = memo(function TagsFilterDialog() {
  const { onFilter, tags, modalType } = useMenu();
  const { handleClose, handleFilters, onClick, filters } = useTagsFilterDialog(onFilter);
  const { t } = useTranslation(["menu", "common"]);
  const { locale } = useRouter();

  const renderTags = useCallback(
    (tag: Tag) => {
      return (
        <Checkbox
          key={tag.id}
          name={getLabel(tag.name, locale!)}
          value={tag.id}
          label={tag.name[locale!]}
          onChange={handleFilters}
          checked={filters.includes(tag.id)}
        />
      );
    },
    [filters, handleFilters, locale]
  );

  return (
    <Dialog
      open={modalType === MenuModal.Tags}
      onClose={handleClose}
      closeText={t("button.cancel", { ns: "common" })}
      className={style.dialog}
    >
      <div className={style.root}>
        <Typography className={style.text}>{t("tags")}</Typography>
        {tags && tags.length > 0 ? (
          <div className={style.bg}>{tags.map(renderTags)}</div>
        ) : (
          <Typography className={style.noTags}>{t("noTags")}</Typography>
        )}
      </div>
      <Button color="primary" variant="contained" onClick={onClick} className={style.btn}>
        {t("button.filterProducts")}
      </Button>
    </Dialog>
  );
});

function useTagsFilterDialog(onFilter: (values: number[]) => void) {
  const { locale, back } = useRouter();

  const handleClose = useCallback(() => {
    back();
  }, [back]);

  const [filters, setFilters] = useState<number[]>([]);

  const handleFilters = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prevState) => {
      const value = Number(e.target.value);
      if (prevState.includes(value)) {
        return prevState.filter((tag) => tag !== value);
      }
      return [...prevState, value];
    });
  }, []);

  const onClick = useCallback(() => {
    onFilter(filters);
    back();
  }, [back, filters, onFilter]);

  return { locale, handleClose, handleFilters, onClick, filters };
}
