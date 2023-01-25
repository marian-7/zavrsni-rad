import { createContext, FC, memo, useCallback, useState } from "react";
import {
  IconButton,
  Snackbar as Snack,
  SnackbarContent,
  Typography,
} from "@material-ui/core";
import style from "../styles/components/Snackbar.module.scss";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";

type Props = {};

type SnackbarContextType = {
  show: (error: string) => void;
};

export const SnackbarContext = createContext<SnackbarContextType>(
  {} as SnackbarContextType
);

export const SnackbarProvider: FC<Props> = memo(function SnackbarProvider({
  children,
}) {
  const { show, message, close } = useSnackbarProvider();

  return (
    <>
      <SnackbarContext.Provider value={{ show }}>
        {children}
      </SnackbarContext.Provider>
      <Snack
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!message}
        autoHideDuration={3000}
        onClose={close}
      >
        <SnackbarContent
          message={<Typography className={style.message}>{message}</Typography>}
          action={
            <IconButton key="close" onClick={close}>
              <CloseIcon className={style.close} />
            </IconButton>
          }
          classes={{ root: style.root }}
        />
      </Snack>
    </>
  );
});

function useSnackbarProvider() {
  const [message, setMessage] = useState<string | undefined>();

  const show = useCallback((error: string) => {
    setMessage(error);
  }, []);

  const close = useCallback(() => {
    setMessage(undefined);
  }, []);

  return { show, message, close };
}
