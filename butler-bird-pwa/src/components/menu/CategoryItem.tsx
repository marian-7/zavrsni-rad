import React, { FC, memo, useCallback, useMemo } from "react";
import { Category } from "domain/types/Category";
import { Typography, useTheme } from "@material-ui/core";
import { useRouter } from "next/router";
import style from "styles/components/menu/category-item.module.scss";
import { useMenu } from "hooks/useMenu";
import { scrollToTargetAdjusted } from "domain/util/scroll";
import { ReactComponent as NoImage } from "assets/icons/no-image.svg";
import { getImage, ImageFormat } from "domain/util/getImage";
import classNames from "classnames";

type Props = {
  category: Category;
  isOffset: boolean;
  isScrollInitiated: boolean;
};

export const CategoryItem: FC<Props> = memo(function Category(props) {
  const { locale, handleSelectCategory, selectedCategory, primaryColor } = useCategory(props);
  const { category, isOffset, isScrollInitiated } = props;
  const { name } = category;

  return (
    <button
      onClick={handleSelectCategory}
      className={classNames(style.categoryItem, {
        [style.scrolledCategoryItemStart]: isOffset,
        [style.scrolledCategoryItemEnd]: !isOffset && isScrollInitiated,
      })}
      style={{
        boxShadow: selectedCategory === category.id ? `inset 0 0 0 2px ${primaryColor}` : "",
      }}
    >
      {category.image ? (
        <img
          src={getImage(category.image, ImageFormat.Medium)}
          className={classNames(style.image, {
            [style.scrolledImage]: isOffset,
            [style.scrolledImageEnd]: !isOffset && isScrollInitiated,
          })}
        />
      ) : (
        <NoImage
          className={classNames(style.image, {
            [style.scrolledImage]: isOffset,
            [style.scrolledImageEnd]: !isOffset && isScrollInitiated,
          })}
        />
      )}
      <Typography
        className={classNames(style.text, {
          [style.scrolledText]: isOffset,
          [style.scrolledTextEnd]: !isOffset && isScrollInitiated,
        })}
      >
        {name[locale!]}
      </Typography>
    </button>
  );
});

function useCategory(props: Props) {
  const { category } = props;
  const { locale } = useRouter();
  const theme = useTheme();

  const { onSelectedCategory, selectedCategory } = useMenu();

  const primaryColor = useMemo(() => {
    return theme.palette.primary.main;
  }, [theme.palette.primary.main]);

  const handleSelectCategory = useCallback(() => {
    scrollToTargetAdjusted(category.id);
    onSelectedCategory(category.id);
  }, [category.id, onSelectedCategory]);

  return { locale, handleSelectCategory, selectedCategory, primaryColor };
}
