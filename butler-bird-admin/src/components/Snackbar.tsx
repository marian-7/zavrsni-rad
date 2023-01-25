import { PureComponent } from "react";
import {
  IconButton,
  Snackbar as Snack,
  SnackbarContent,
  Typography,
} from "@material-ui/core";
import style from "styles/components/Snackbar.module.scss";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";

interface Props {}

interface State {
  message?: string;
}

export class Snackbar extends PureComponent<Props, State> {
  static _instance: Snackbar | undefined;

  static show(message: string) {
    Snackbar._instance?.setState({ message });
  }

  constructor(props: Props) {
    super(props);
    if (!Snackbar._instance) {
      Snackbar._instance = this;
    }
    return Snackbar._instance;
  }

  state: State = {};

  close = () => {
    this.setState({ message: undefined });
  };

  render() {
    const { message } = this.state;
    return (
      <Snack
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!message}
        autoHideDuration={3000}
        onClose={this.close}
      >
        <SnackbarContent
          message={<Typography className={style.message}>{message}</Typography>}
          action={
            <IconButton key="close" onClick={this.close}>
              <CloseIcon className={style.close} />
            </IconButton>
          }
          classes={{ root: style.root }}
        />
      </Snack>
    );
  }
}
