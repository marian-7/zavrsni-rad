import React, { FC, memo, useMemo } from "react";
import style from "styles/components/menu/menu-header.module.scss";
import { useTable } from "hooks/useTable";
import { useOrder } from "hooks/useOrder";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { LinkButton } from "components/LinkButton";
import { useTranslation } from "next-i18next";
import Badge from "@material-ui/core/Badge";
import { Icon, IconButton } from "@material-ui/core";
import { ReactComponent as ShoppingCart } from "assets/icons/shopping-cart.svg";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { OrganizationMode } from "domain/types/Organization";

type Props = {
  onClickMenuButton: () => void;
  onClick: () => void;
  link: string;
};

export const MenuHeader: FC<Props> = memo(function MenuHeader({
  onClickMenuButton,
  onClick,
  link,
}) {
  const { count, showCart } = useMenuHeader();
  const { logo } = useTable();
  const { t } = useTranslation("common");

  return (
    <div className={style.container}>
      <LinkButton
        href={link}
        startIcon={<ArrowBackIosIcon />}
        className={style.iconBtn}
        variant="text"
      >
        {t("button.back", { ns: "common" })}
      </LinkButton>
      {logo && <img src={logo} className={style.logo} />}
      <div>
        {showCart && (
          <IconButton onClick={onClick}>
            {count ? (
              <Badge badgeContent={count} color="primary">
                <Icon color="primary">
                  <ShoppingCart />
                </Icon>
              </Badge>
            ) : (
              <ShoppingCart className={style.checkout} />
            )}
          </IconButton>
        )}
        <IconButton onClick={onClickMenuButton} className={style.btn} children={<MoreVertIcon />} />
      </div>
    </div>
  );
});

function useMenuHeader() {
  const { order } = useOrder();

  const { table } = useTable();

  const showCart = useMemo(() => {
    return table && table.mode !== OrganizationMode.View;
  }, [table]);

  const count = useMemo(() => {
    return order?.items.length;
  }, [order?.items.length]);

  return { count, showCart };
}
