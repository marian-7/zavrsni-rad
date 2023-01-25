import React, { FC, memo } from "react";
import { Option } from "domain/types/Option";
import { Label } from "components/Label";
import { Radio } from "components/Radio";
import { useRouter } from "next/router";
import { getLabel } from "domain/util/text";
import style from "styles/components/item/radio-item.module.scss";
import { useModifierLabel } from "hooks/useModifierLabel";
import { Description } from "components/item/Description";
import { ViewOnlyItem } from "./ViewOnlyItem";

type Props = {
  option: Option;
  showControl: boolean;
};

export const RadioItem: FC<Props> = memo(function RadioItem({ option, showControl }) {
  const { id, price, name, description } = option;
  useRadioItem();
  const formattedPrice = useModifierLabel(price);
  const { locale } = useRouter();

  return (
    <div className="full-width">
      {showControl ? (
        <>
          <Radio
            value={id}
            radioClassName={style.radio}
            label={<Label text={getLabel(name, locale!)} price={formattedPrice} />}
          />
          {description && <Description text={getLabel(description, locale!)} />}
        </>
      ) : (
        <ViewOnlyItem option={option} formattedPrice={formattedPrice} />
      )}
    </div>
  );
});

function useRadioItem() {}
