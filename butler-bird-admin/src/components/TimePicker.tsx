import { ChangeEvent, FC, memo } from "react";
import {
  FormControl,
  FormHelperText,
  Icon,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { time } from "util/time";
import style from "styles/components/TimePicker.module.scss";
import { ReactComponent as WarningIcon } from "assets/icons/warning.svg";
import classNames from "classnames";
import { SelectProps } from "@material-ui/core/Select";

export type TimePickerProps = SelectProps & {
  name: string;
  value?: string;
  onValueChange: (value?: string) => void;
  errorMessage?: string;
  withHelperText?: boolean;
};

export const TimePicker: FC<TimePickerProps> = memo(function TimePicker(props) {
  const {
    errorMessage,
    withHelperText,
    onValueChange,
    className,
    ...rest
  } = props;
  const { handleChange } = useTimePicker(props);

  function renderOptions() {
    return time().map((value) => {
      return (
        <MenuItem key={value} value={value} classes={{ root: style.item }}>
          <Typography className={style.itemLabel}>
            {value.slice(0, 5)}
          </Typography>
        </MenuItem>
      );
    });
  }

  return (
    <FormControl
      error={!!errorMessage}
      className={classNames(style.formControl, {
        [style.formControlWithHelperText]: withHelperText,
      })}
    >
      <Select
        {...rest}
        error={!!errorMessage}
        onChange={handleChange}
        disableUnderline
        classes={{ root: style.input }}
        MenuProps={{
          getContentAnchorEl: null,
          classes: { paper: style.paper, list: style.list },
          anchorOrigin: {
            vertical: 43,
            horizontal: 0,
          },
        }}
      >
        {renderOptions()}
      </Select>
      {withHelperText && (
        <FormHelperText
          hidden={!errorMessage}
          error={!!errorMessage}
          className={style.helperText}
          classes={{ root: style.error }}
        >
          {errorMessage && (
            <Icon
              component={WarningIcon}
              className={classNames("MuiSvgIcon-error", style.errorIcon)}
            />
          )}
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
});

function useTimePicker({ onValueChange }: TimePickerProps) {
  function handleChange(e: ChangeEvent<{ value: unknown }>) {
    onValueChange(e.target.value as string);
  }

  return { handleChange };
}
