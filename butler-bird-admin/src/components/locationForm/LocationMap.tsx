import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import style from "styles/components/locationForm/LocationMap.module.scss";
import { useTranslation } from "react-i18next";
import { Pin, SearchSuggestion } from "domain/models/Location";
import { QueryFunctionContext, useQuery } from "react-query";
import {
  HereAutocompleteResponse,
  locationsService,
} from "domain/services/locationsService";
import { Autocomplete } from "@material-ui/lab";
import { CircularProgress, InputAdornment, TextField } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { LocationFormValues } from "components/locationForm/LocationForm";
import inputStyle from "styles/components/Input.module.scss";
import { mapData } from "domain/util/axios";
import { throttle } from "lodash";

export interface SearchQuery {
  query: string;
  at: string;
}

type Props = {
  value: Pin[];
  onValueChange: (value: Omit<Pin, "id">[]) => void;
};

export const LocationMap: FC<Props> = memo(function LocationMap(props) {
  const {
    mapContainerRef,
    handleSearchChange,
    t,
    suggestions,
    suggestionsLoading,
    handleSuggestionClick,
  } = useLocationMap(props);

  function renderOption(option: SearchSuggestion) {
    return (
      <div onClick={() => handleSuggestionClick(option)}>
        {option.address.label}
      </div>
    );
  }

  function onChange(
    event: ChangeEvent<{}>,
    newValue: SearchSuggestion | string | null
  ) {
    if (newValue !== null && typeof newValue !== "string") {
      handleSuggestionClick(newValue);
    }
  }

  return (
    <>
      <Autocomplete
        freeSolo
        clearOnEscape
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t("form.placeholders.locationAddress")}
            onChange={handleSearchChange}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              className: "",
              classes: {
                input: inputStyle.input,
                focused: inputStyle.focus,
                root: classNames(inputStyle.root, style.input),
                error: inputStyle.error,
              },
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    {suggestionsLoading ? (
                      <CircularProgress color="primary" size={18} />
                    ) : (
                      <SearchIcon className={style.icon} />
                    )}
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
        options={suggestions}
        getOptionLabel={(option) => option?.address?.label ?? ""}
        loading={suggestionsLoading}
        renderOption={renderOption}
        onChange={onChange}
      />
      <div className={style.map} ref={mapContainerRef} />
    </>
  );
});

function useLocationMap({ value, onValueChange }: Props) {
  const { REACT_APP_HERE_MAP_API_KEY } = process.env;
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { setFieldValue } = useFormikContext<LocationFormValues>();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const initialValueRef = useRef(value);
  const valueChangeRef = useRef(onValueChange);
  valueChangeRef.current = onValueChange;
  const mapRef = useRef<H.Map>();
  const pinObjectRef = useRef<H.map.Object>();
  const pinpointRef = useRef<H.geo.IPoint>();

  const setLocationPin = useCallback(
    (position: H.geo.IPoint, center = false) => {
      if (pinObjectRef.current) {
        mapRef.current?.removeObject(pinObjectRef.current);
      }
      pinObjectRef.current = new H.map.Marker(position);
      mapRef.current?.addObject(pinObjectRef.current);
      pinpointRef.current = position;
      if (center) {
        mapRef.current?.setCenter(position);
      }
    },
    []
  );

  useLayoutEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }
    const H = window.H;
    const platform = new H.service.Platform({
      apikey: `${REACT_APP_HERE_MAP_API_KEY}`,
    });
    const defaultLayers = platform.createDefaultLayers();
    const { latitude, longitude } = initialValueRef.current?.[0] ?? {};
    const hMap = new H.Map(
      mapContainerRef.current,
      defaultLayers.vector.normal.map,
      {
        center: {
          lat: latitude ?? 51.4934,
          lng: longitude ?? 0.0098,
        },
        zoom: 14,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );
    mapRef.current = hMap;

    const handleResize = () => hMap.getViewPort().resize();
    setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);

    const mapEvents = new H.mapevents.MapEvents(hMap);
    new H.mapevents.Behavior(mapEvents);
    H.ui.UI.createDefault(hMap, defaultLayers);

    hMap.addEventListener("tap", (e: any) => {
      const coordinates = hMap.screenToGeo(
        e.currentPointer.viewportX,
        e.currentPointer.viewportY
      );
      setLocationPin(coordinates);
      valueChangeRef.current([
        { latitude: coordinates.lat, longitude: coordinates.lng },
      ]);
    });

    return () => {
      hMap.dispose();
    };
  }, [REACT_APP_HERE_MAP_API_KEY, setLocationPin]);

  const handleSuggestionClick = useCallback(
    (option: SearchSuggestion) => {
      const { lat, lng } = option.position;
      onValueChange([
        {
          latitude: lat,
          longitude: lng,
        },
      ]);
      setFieldValue("address", option.address.label);
      mapRef.current?.setCenter({
        lat,
        lng,
      });
      setLocationPin({ lat, lng });
    },
    [onValueChange, setFieldValue, setLocationPin]
  );

  const getSuggestions = (
    params: QueryFunctionContext<[string, SearchQuery]>
  ): Promise<HereAutocompleteResponse> => {
    const [, { query, at }] = params.queryKey;
    return locationsService.searchLocation({ query, at }).then(mapData);
  };

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery(
    [
      "suggestions",
      {
        query: search,
        at: `${mapRef.current?.getCenter().lat},${
          mapRef.current?.getCenter().lng
        }`,
      },
    ],
    throttle(getSuggestions, 250),
    {
      enabled: search.length > 3,
    }
  );

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value ?? "");
  }

  useEffect(() => {
    const initialPoint = value?.[0];
    const pinpoint = pinpointRef.current;
    if (initialPoint && !pinpoint) {
      setLocationPin(
        { lat: initialPoint.latitude, lng: initialPoint.longitude },
        true
      );
    } else if (
      initialPoint &&
      pinpoint &&
      (initialPoint.latitude !== pinpoint.lat ||
        initialPoint.longitude !== pinpoint.lng)
    ) {
      setLocationPin(
        { lat: initialPoint.latitude, lng: initialPoint.longitude },
        true
      );
    }
  }, [setLocationPin, value]);

  return {
    mapContainerRef,
    search,
    handleSearchChange,
    t,
    suggestions: suggestions?.items ?? [],
    suggestionsLoading,
    handleSuggestionClick,
  };
}
