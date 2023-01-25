import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from "overlayscrollbars-react";
import { forwardRef, useCallback, useEffect } from "react";
import { useRef } from "react";

interface Props extends OverlayScrollbarsComponentProps {}

export const Overflow = forwardRef<OverlayScrollbarsComponent, Props>(
  ({ children, onScroll, ...rest }, ref) => {
    const ofRef = useRef<OverlayScrollbarsComponent | null>(null);

    useEffect(() => {
      const el = ofRef.current?.osInstance().getElements().viewport;

      if (onScroll) {
        el.addEventListener("scroll", onScroll);
      }
      return () => {
        if (onScroll) {
          el.removeEventListener("scroll", onScroll);
        }
      };
    }, [onScroll]);

    const handleRef = useCallback(
      (instance: OverlayScrollbarsComponent | null) => {
        ofRef.current = instance;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ref = ofRef;
      },
      []
    );

    return (
      <OverlayScrollbarsComponent
        options={{ scrollbars: { autoHide: "scroll" }, sizeAutoCapable: false }}
        {...rest}
        ref={handleRef}
      >
        {children}
      </OverlayScrollbarsComponent>
    );
  }
);
