import { useContext } from "react";
import { MenuContext } from "context/MenuContext";

export function useMenu() {
  return useContext(MenuContext);
}
