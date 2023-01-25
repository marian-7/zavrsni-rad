import React, { FC, memo } from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import { NavLink as Link, NavLinkProps } from "react-router-dom";

type Props = ButtonProps & NavLinkProps;

export const LinkButton: FC<Props> = memo(function LinkButton(props) {
  useLinkButton();

  return <Button component={Link} {...props} />;
});

function useLinkButton() {}
