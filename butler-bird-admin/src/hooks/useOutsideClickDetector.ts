import { MutableRefObject, useEffect } from "react";

export function useOutsideClickDetector(
  ref: MutableRefObject<any>,
  cb: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      const isDropdownPicker =
        typeof event.target.className === "string" &&
        !event.target.className.includes("MuiListItem-button") &&
        !event.target.parentNode.className.includes("MuiPopover-root");
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        isDropdownPicker
      ) {
        cb();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cb, ref]);
}
