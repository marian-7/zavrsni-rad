import { UserContext } from "context/UserContext";
import React, { FC, memo, useCallback, useMemo, useRef } from "react";
import { AddressForm } from "pages/tables/[id]/location/confirm";
import { Cookies, getCookie, setCookieByName } from "domain/util/cookies";
import { useQuery, useQueryClient } from "react-query";
import { getUserAddresses } from "domain/services/userService";
import { useSession } from "next-auth/client";

type Props = {};

export const UserProvider: FC<Props> = memo(function UserProvider({ children }) {
  const { selectedLocation, setUserDefaultLocation, userAddresses } = useUserProvider();

  return (
    <UserContext.Provider
      value={{ userAddresses, setUserDefaultLocation, userLocation: selectedLocation }}
    >
      {children}
    </UserContext.Provider>
  );
});

function useUserProvider() {
  const { current: key } = useRef("selectedLocation");
  const queryClient = useQueryClient();
  const [session] = useSession();

  const { data: userAddresses } = useQuery("locations", async () => {
    try {
      const res = await getUserAddresses(session?.accessToken);
      return { addresses: res.data };
    } catch (err) {}
  });

  const { data: cachedDefaultLocation } = useQuery(key, () => {
    queryClient.getQueryData<AddressForm>(key);
  });

  const setUserDefaultLocation = useCallback(
    (location: AddressForm) => {
      queryClient.setQueryData(key, location);
      setCookieByName(Cookies.SelectedLocation, JSON.stringify(location));
    },
    [key, queryClient]
  );

  const selectedLocation = useMemo(() => {
    const locationFromCookie = getCookie(Cookies.SelectedLocation);
    if (locationFromCookie) {
      return JSON.parse(locationFromCookie);
    }
    return cachedDefaultLocation;
  }, [cachedDefaultLocation]);

  return {
    setUserDefaultLocation,
    selectedLocation,
    userAddresses: userAddresses?.addresses,
  };
}
