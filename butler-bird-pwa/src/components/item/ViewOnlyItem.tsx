import React, { FC, memo } from "react";
import style from "styles/components/item/view-only-item.module.scss";
import { Description } from "./Description";
import { getLabel } from "domain/util/text";
import { Label } from "components/Label";
import { Option } from "domain/types/Option";
import { useRouter } from "next/router";
import classNames from "classnames";

type Props = {
  option: Option;
  formattedPrice: string | null;
};

export const ViewOnlyItem: FC<Props> = memo(function ViewOnlyItem({ option, formattedPrice }) {
  useViewOnlyItem();
  const { name, description } = option;
  const { locale } = useRouter();

  return (
    <div className={style.labelContainer}>
      <Label
        className={classNames(style.label, { [style.noDescription]: !description })}
        text={getLabel(name, locale!)}
        price={formattedPrice}
      />
      {description && (
        <Description text={getLabel(description, locale!)} className={style.description} />
      )}
    </div>
  );
});

function useViewOnlyItem() {}
