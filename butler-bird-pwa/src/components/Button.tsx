import React, { FC, memo, useCallback } from "react";
import { ButtonProps, Button as MuiButton } from "@material-ui/core";
import style from "styles/components/button.module.scss";
import classNames from "classnames";

type Props = ButtonProps & {
  loading?: boolean;
  loadingText?: string;
};

export const Button: FC<Props> = memo(function Button(props) {
  useButton();
  const { variant, children, loading, loadingText, ...rest } = props;

  const renderLoadingUI = useCallback(() => {
    return <div className={style.loadingContent}>{loadingText}</div>;
  }, [loadingText]);

  return (
    <MuiButton
      classes={{
        root: classNames({
          [style.rootText]: variant === "text",
          [style.root]: variant !== "text",
        }),
        containedSecondary: style.containedSecondary,
        containedPrimary: style.containedPrimary,
      }}
      variant={variant}
      {...rest}
    >
      {loading ? renderLoadingUI() : children}
    </MuiButton>
  );
});

function useButton() {}
