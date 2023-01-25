import { useContext } from "react";
import { I18nextContext } from "providers/I18nextProvider";

export function useLocal() {
  const ctx = useContext(I18nextContext);
  return {
    local: ctx.lng,
    setLocal: ctx.setLng,
  };
}
