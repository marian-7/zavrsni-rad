import React, { FC, memo } from "react";
import style from "styles/components/header.module.scss";
import { ReactComponent as ShoppingCart } from "assets/icons/shopping-cart.svg";
import { IconButton, Icon } from "@material-ui/core";
import classNames from "classnames";
import Badge from "@material-ui/core/Badge";
import { ReactComponent as Logo } from "assets/icons/logo.svg";
import MoreVertIcon from "@material-ui/icons/MoreVert";

type Props = {
  menu?: boolean;
  onClickMenuButton?: () => void;
  appLogo?: boolean;
  containerClassName?: string;
  shoppingCart?: boolean;
  orderCount?: number;
  goToOrderPreview?: () => void;
};

export const Header: FC<Props> = memo(function Header(props) {
  useHeader();
  const {
    onClickMenuButton,
    containerClassName,
    orderCount,
    goToOrderPreview,
    menu = false,
    appLogo = false,
    shoppingCart = false,
  } = props;

  return (
    <div className={classNames(style.container, containerClassName)}>
      {appLogo && <Logo className={style.icon} />}

      <div className={style.right}>
        {shoppingCart && (
          <IconButton onClick={goToOrderPreview}>
            {orderCount ? (
              <Badge badgeContent={orderCount} color="primary">
                <Icon color="primary">
                  <ShoppingCart />
                </Icon>
              </Badge>
            ) : (
              <ShoppingCart className={style.checkout} />
            )}
          </IconButton>
        )}
        {menu && (
          <IconButton
            onClick={onClickMenuButton}
            className={style.btn}
            children={<MoreVertIcon />}
          />
        )}
      </div>
    </div>
  );
});

function useHeader() {}
