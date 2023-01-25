import React, { FC, memo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Category } from "domain/types/Category";
import { CategoryItem } from "components/menu/CategoryItem";
import style from "styles/components/menu/category-picker.module.scss";
import { useMenu } from "hooks/useMenu";
import classNames from "classnames";

type Props = {
  isOffset: boolean;
  isScrollInitiated: boolean;
};

export const CategoryPicker: FC<Props> = memo(function CategoryPicker({
  isOffset,
  isScrollInitiated,
}) {
  const { categories } = useCategoryPicker();

  const renderCategory = useCallback(
    (category: Category) => {
      return (
        <SwiperSlide key={category.id}>
          <CategoryItem
            category={category}
            isOffset={isOffset}
            isScrollInitiated={isScrollInitiated}
          />
        </SwiperSlide>
      );
    },
    [isOffset, isScrollInitiated]
  );

  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={24}
      className={classNames(style.categoryPicker, {
        [style.shrinkCategoryPicker]: isOffset,
        [style.end]: !isOffset && isScrollInitiated,
      })}
    >
      {categories?.map(renderCategory)}
    </Swiper>
  );
});

function useCategoryPicker() {
  const { categoriesList } = useMenu();

  return { categories: categoriesList };
}
