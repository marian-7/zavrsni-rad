import { useCallback, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Position } from "domain/types/Location";
import { Cookies, deleteCookie, getCookie, setCookieByName } from "domain/util/cookies";
import { AddressForm } from "pages/tables/[id]/location/confirm";

export function useLocation() {
  const { current: key } = useRef("coordinates");
  const { current: locationKey } = useRef("location");

  const queryClient = useQueryClient();

  const { data: cachedCoordinates } = useQuery(key, () => {
    queryClient.getQueryData<Position>(key);
  });

  const { data: cachedLocation } = useQuery(locationKey, () => {
    queryClient.getQueryData<AddressForm>(locationKey);
  });

  const setCoordinates = useCallback(
    (coordinates: Position) => {
      queryClient.setQueryData(key, coordinates);
      setCookieByName(Cookies.Coordinates, JSON.stringify(coordinates));
    },
    [key, queryClient]
  );

  const setLocation = useCallback(
    (location: AddressForm) => {
      queryClient.setQueryData(locationKey, location);
      setCookieByName(Cookies.Location, JSON.stringify(location));
    },
    [locationKey, queryClient]
  );

  const coordinates = useMemo<Position | undefined>(() => {
    const coordinatesFromCookie = getCookie(Cookies.Coordinates);
    if (coordinatesFromCookie) {
      return JSON.parse(coordinatesFromCookie);
    }
    return cachedCoordinates;
  }, [cachedCoordinates]);

  const location = useMemo(() => {
    const locationFromCookie = getCookie(Cookies.Location);
    if (locationFromCookie) {
      return JSON.parse(locationFromCookie);
    }
    return cachedLocation;
  }, [cachedLocation]);

  const clear = useCallback(() => {
    queryClient.setQueryData(Cookies.Coordinates, undefined);
    queryClient.setQueryData(Cookies.Location, undefined);
    deleteCookie(Cookies.Location);
    deleteCookie(Cookies.Coordinates);
  }, [queryClient]);

  return { coordinates, setCoordinates, location, setLocation, clear };
}
