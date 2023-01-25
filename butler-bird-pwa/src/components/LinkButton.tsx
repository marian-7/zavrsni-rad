import React, { FC, memo } from "react";
import { Button, ButtonProps } from "@material-ui/core";
import Link from "next/link";
import { UrlObject } from "url";
import style from "styles/components/button.module.scss";
import classNames from "classnames";

type Props = ButtonProps & {
  href: string | UrlObject;
};

export const LinkButton: FC<Props> = memo(function LinkButton(props) {
  useLinkButton();
  const { href, variant, ...buttonProps } = props;

  return (
    <Link href={href}>
      <Button
        variant={variant}
        {...buttonProps}
        classes={{
          root: classNames({
            [style.rootText]: variant === "text",
            [style.root]: variant !== "text",
          }),
          startIcon: style.icon,
        }}
      />
    </Link>
  );
});

function useLinkButton() {}
