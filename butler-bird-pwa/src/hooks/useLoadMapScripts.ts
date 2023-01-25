import { useEffect, useRef, useState } from "react";
import { mapScripts } from "domain/util/externalScripts";

export function useLoadMapScripts() {
  const [allLoaded, setAllLoaded] = useState(false);
  let scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const loadScript = (script: string) => {
      return new Promise((resolve) => {
        scriptRef.current = document.createElement("script");
        scriptRef.current?.setAttribute("src", script);
        scriptRef.current?.addEventListener("load", resolve);
        document.body.appendChild(scriptRef.current);
      });
    };
    (async () => {
      for (let i = 0; i <= mapScripts.length - 1; i++) {
        await Promise.all(mapScripts[i].map(loadScript));
      }
      setAllLoaded(true);
    })();
  }, [scriptRef]);

  return { allLoaded };
}
