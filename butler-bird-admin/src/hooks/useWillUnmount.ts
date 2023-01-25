import { useEffect, useRef } from "react";

export function useWillUnmount() {
  const willUnmount = useRef(false);

  useEffect(
    () => () => {
      willUnmount.current = true;
    },
    []
  );

  return willUnmount;
}
