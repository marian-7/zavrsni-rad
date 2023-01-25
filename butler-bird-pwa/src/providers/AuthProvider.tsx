import React, { FC, memo } from "react";
import { useSession } from "next-auth/client";
import { usePrevious } from "hooks/usePrevious";
import { isClient } from "domain/util/util";
import { api } from "domain/services/apiService";

type Props = {};

export const AuthProvider: FC<Props> = memo(function AuthProvider({ children }) {
  useAuthProvider();

  return <>{children}</>;
});

function useAuthProvider() {
  const [session] = useSession();

  const currentJwt = session?.accessToken;
  const prevJwt = usePrevious(currentJwt);
  if (isClient && currentJwt !== prevJwt) {
    if (currentJwt) {
      api.defaults.headers.Authorization = `Bearer ${currentJwt}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  }
}
