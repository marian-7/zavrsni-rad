import { useRouter as useRouterNext } from "next/router";
import { useCallback } from "react";
import * as querystring from "querystring";
import { UrlObject } from "url";

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
  preserveQuery?: boolean;
}

type Url = UrlObject | string;

export function useRouter() {
  const router = useRouterNext();

  const push = useCallback(
    async (url: Url, as?: Url, options?: TransitionOptions) => {
      if (options && options.preserveQuery) {
        await router.push(`${url}?${querystring.stringify({ ...router.query })}`, as, options);
      } else {
        await router.push(url, as, options);
      }
    },
    [router]
  );

  return { ...router, push };
}
