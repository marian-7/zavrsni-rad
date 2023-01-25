import { useContext } from "react";
import { SnackbarContext } from "providers/SnackbarProvider";

export function useSnackbar() {
  return useContext(SnackbarContext);
}
