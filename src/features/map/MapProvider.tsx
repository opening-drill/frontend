import React, {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import Map from "ol/Map";
import { fromLonLat } from "ol/proj";

interface MapContextProps {
  mapRef: React.MutableRefObject<Map | null>;
  goToLocation: (coords: number[], zoom?: number) => void;
}

const MapContext = createContext<MapContextProps | null>(null);

const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<Map | null>(null);

  const goToLocation = (
    coords: number[],
    zoom: number = 19.5,
    heading?: number
  ) => {
    if (mapRef.current) {
      const rotationInRadians = degreesToRadians(heading);

      mapRef.current.getView().animate({
        center: fromLonLat(coords),
        zoom: zoom,
        duration: 2000,
        rotation: rotationInRadians,
      });
    }
  };

  return (
    <MapContext.Provider value={{ mapRef, goToLocation }}>
      {children}
    </MapContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMap = () => {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
