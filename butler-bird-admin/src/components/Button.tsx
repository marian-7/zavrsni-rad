import { FC, memo, ElementType, useRef, useMemo } from "react";
import MuiButton, { ButtonProps } from "@material-ui/core/Button";
import classNames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import { capitalize } from "@material-ui/core";

type Props = ButtonProps & {
  rootClassName?: string;
  to?: string;
  component?: ElementType;
  loading?: boolean;
};

export const Button: FC<Props> = memo(function Button(props) {
  const { children, rootClassName, loading, variant, color, ...rest } = props;
  const { ref, width } = useButton(props);

  return (
    <MuiButton
      style={{ minWidth: width }}
      classes={{
        root: classNames(rootClassName, {
          "MuiButton-loading": loading,
          [`MuiButton-loading${variant ? capitalize(variant) : ""}${
            color ? capitalize(color) : ""
          }`]: loading,
        }),
      }}
      ref={ref}
      disabled={loading}
      variant={variant}
      color={color}
      {...rest}
      startIcon={loading ? null : rest.startIcon}
      endIcon={loading ? null : rest.endIcon}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </MuiButton>
  );
});

function useButton({ loading }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  const width = useMemo(() => {
    const el = ref.current;
    if (loading && el) {
      return el.getBoundingClientRect().width;
    }
  }, [loading]);

  return { ref, width };
}
