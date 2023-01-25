import { useEffect, useState } from "react";
import { throttle } from "lodash";

function useWindowScrollPosition(wait = 100) {
  const [position, setPosition] = useState({
    x: window.pageXOffset,
    y: window.pageYOffset,
  });

  useEffect(() => {
    const handle = throttle(() => {
      setPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      });
    }, wait);

    window.addEventListener("scroll", handle);
    return () => {
      window.removeEventListener("scroll", handle);
    };
  }, [wait]);

  return position;
}
export default useWindowScrollPosition;
