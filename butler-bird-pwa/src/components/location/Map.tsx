import React, { FC, memo, useLayoutEffect, useRef } from "react";
import { useLocation } from "hooks/useLocation";

type Props = {
  className: string;
  handleAnimation: () => void;
};

export const Map: FC<Props> = memo(function Map(props) {
  const { className, children } = props;
  const { mapContainerRef } = useMap(props);

  return (
    <>
      <div className={className} ref={mapContainerRef}>
        {children}
      </div>
    </>
  );
});

function useMap(props: Props) {
  const { handleAnimation } = props;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<H.Map>();
  const { setCoordinates } = useLocation();

  const initialValueRef = useRef([]);

  useLayoutEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }
    const H = window.H;
    const platform = new H.service.Platform({
      apikey: process.env.NEXT_PUBLIC_HERE_MAPS_API_KEY,
    });

    const layers = platform.createDefaultLayers();
    const { latitude, longitude } = initialValueRef.current?.[0] ?? {};

    mapRef.current = new H.Map(mapContainerRef.current, layers.vector.normal.map, {
      pixelRatio: window.devicePixelRatio,
      center: { lat: latitude ?? 45.7782934, lng: longitude ?? 15.9877345 },
      zoom: 16,
    });

    const handleResize = () => mapRef.current?.getViewPort().resize();
    setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);

    const mapEvents = new H.mapevents.MapEvents(mapRef.current);
    new H.mapevents.Behavior(mapEvents);
    H.ui.UI.createDefault(mapRef.current, layers);

    mapRef.current?.addEventListener("dragstart", () => {
      handleAnimation();
    });

    mapRef.current?.addEventListener("dragend", () => {
      handleAnimation();
      setCoordinates({
        lat: mapRef.current?.getCenter().lat,
        lng: mapRef.current?.getCenter().lng,
      });
    });

    return () => {
      mapRef.current?.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [handleAnimation, setCoordinates]);

  return { mapContainerRef };
}
