import { ThemeContext } from "providers/ThemeProvider";
import { useContext } from "react";

export function useTheme() {
  return useContext(ThemeContext);
}
