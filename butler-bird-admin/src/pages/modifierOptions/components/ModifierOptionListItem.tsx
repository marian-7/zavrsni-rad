import React, { FC, memo } from "react";
import { LinkButton } from "components/LinkButton";
import { Typography } from "@material-ui/core";
import { useLocal } from "hooks/useLocal";
import style from "styles/pages/modifierOptions/components/ModifierOptionListItem.module.scss";
import { ReactComponent as ArrowIcon } from "assets/icons/arrow-forward.svg";
import { useTranslation } from "react-i18next";
import { getFormattedPrice } from "domain/util/price";
import { useOrganization } from "hooks/useOrganization";
import { getLabel } from "domain/util/text";
import { Option } from "domain/models/OptionGroup";

type Props = {
  option: Option;
  to: string;
};

export const ModifierOptionListItem: FC<Props> = memo(
  function ModifierListItem({ option, to }) {
    const { local, t, organization } = useModifierListItem();

    return (
      <LinkButton to={to} className={style.item}>
        <div>
          <Typography component="span" className={style.label}>
            {option && getLabel(option.name, local)}
          </Typography>
          {organization && (
            <Typography component="span" className={style.price}>
              {t("pages.modifierItems.modifierItemPrice", {
                price: getFormattedPrice(
                  option?.price,
                  local,
                  organization.currency
                ),
              })}
            </Typography>
          )}
        </div>
        <ArrowIcon className={style.arrow} />
      </LinkButton>
    );
  }
);

function useModifierListItem() {
  const { t } = useTranslation();
  const { local } = useLocal();
  const organization = useOrganization();

  return { local, t, organization };
}
