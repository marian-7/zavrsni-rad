import {
  createContext,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { LoginFormValues } from "pages/login/components/LoginForm";
import { LoginResponse, userService } from "domain/services/userService";
import { storageService } from "domain/services/storageService";
import { apiService } from "domain/services/apiService";
import { User } from "domain/models/User";
import { AxiosResponse } from "axios";
import { useLocation, matchPath } from "react-router-dom";
import { paths } from "paths";

type Props = {};

type UserContextType = {
  login: (values: LoginFormValues) => Promise<AxiosResponse<LoginResponse>>;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | undefined;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

export const UserProvider: FC<Props> = memo(function UserProvider({
  children,
}) {
  const { login, logout, isAuthenticated, user } = useUserProvider();

  return (
    <UserContext.Provider value={{ login, logout, isAuthenticated, user }}>
      {children}
    </UserContext.Provider>
  );
});

function useUserProvider() {
  const location = useLocation();
  const match = matchPath<{ slug: string }>(
    location.pathname,
    paths.organization()
  );
  const slug = match?.params.slug;
  const queryClient = useQueryClient();
  const [token, setToken] = useState(
    slug ? storageService.getAccessToken(slug) : null
  );
  const { data: user } = useQuery("user", (ctx) =>
    queryClient.getQueryData(ctx.queryKey)
  );

  const fetchUser = useCallback(() => userService.me(), []);

  const onLoginSuccess = useCallback(
    ({ data }: AxiosResponse<LoginResponse>) => {
      setToken(data.jwt);
      queryClient.setQueryData("user", data.user);
    },
    [queryClient]
  );

  const { mutateAsync: loginMutation } = useMutation(
    ({ identifier, password }: LoginFormValues) =>
      userService.login(identifier, password),
    { onSuccess: onLoginSuccess }
  );

  const login = useCallback(
    (values: LoginFormValues) => loginMutation(values),
    [loginMutation]
  );

  const logout = useCallback(() => {
    setToken(null);
    delete apiService.defaults.headers.Authorization;
    storageService.removeAccessToken(slug!);
    setTimeout(() => queryClient.resetQueries(), 0);
  }, [queryClient, slug]);

  useEffect(() => {
    if (token && slug) {
      apiService.defaults.headers.Authorization = `Bearer ${token}`;
      storageService.setAccessToken(slug, token);
      fetchUser().then(({ data }) => queryClient.setQueryData("user", data));
    }
  }, [fetchUser, queryClient, slug, token]);

  return { login, logout, user, isAuthenticated: !!token };
}
