import { FC, memo, ReactNode } from "react";
import {
  FormControl,
  InputProps as MuiInputProps,
  Input as MuiInput,
  FormHelperText,
  Icon,
  InputLabel,
} from "@material-ui/core";
import { ReactComponent as WarningIcon } from "assets/icons/warning.svg";
import style from "styles/components/Input.module.scss";
import classNames from "classnames";

export type InputProps = MuiInputProps & {
  label?: ReactNode;
  errorMessage?: string;
  errorIcon?: boolean;
  withHelperText?: boolean;
  textAlign?: string;
};

export const Input: FC<InputProps> = memo(function Input({
  className,
  errorMessage,
  label,
  withHelperText = true,
  errorIcon = true,
  textAlign,
  ...props
}) {
  useInput();

  return (
    <FormControl
      error={!!errorMessage}
      className={classNames(className, style.formControl, {
        [style.formControlWithHelperText]: withHelperText,
      })}
    >
      {label && (
        <InputLabel shrink className={style.label} htmlFor={props.name}>
          {label}
        </InputLabel>
      )}
      <MuiInput
        {...props}
        error={!!errorMessage}
        disableUnderline
        classes={{
          input: classNames(style.input, textAlign),
          focused: style.focus,
          root: style.root,
          error: style.error,
        }}
      />
      {withHelperText && (
        <FormHelperText
          hidden={!errorMessage}
          error={!!errorMessage}
          className={style.helperText}
        >
          {errorMessage}
          {errorMessage && errorIcon && (
            <Icon
              component={WarningIcon}
              className={classNames("MuiSvgIcon-error", style.errorIcon)}
            />
          )}
        </FormHelperText>
      )}
    </FormControl>
  );
});

function useInput() {}
