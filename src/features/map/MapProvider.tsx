import Map from "ol/Map";
import { fromLonLat } from "ol/proj";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface MapContextProps {
  mapRef: React.MutableRefObject<Map | null>;
  coords: number[];
  setCoords: React.Dispatch<React.SetStateAction<number[]>>;
  goToLocation: (coords: number[], zoom?: number, heading?: number) => void;
}

const MapContext = createContext<MapContextProps | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<Map | null>(null);
  const [coords, setCoords] = useState<number[]>([34.4668, 31.5016]);

  const goToLocation = (
    coords: number[],
    zoom?: number,
    _heading?: number // Kept for signature compatibility, but ignored for map rotation
  ) => {
    if (mapRef.current) {
      const options: any = {
        center: fromLonLat(coords),
        duration: 1000,
      };
      if (zoom !== undefined) {
        options.zoom = zoom;
      }
      mapRef.current.getView().animate(options);
    }
  }

  const contextValue = React.useMemo(
    () => ({ mapRef, coords, setCoords, goToLocation }),
    [coords, setCoords, goToLocation],
  );

  return (
    <MapContext.Provider value={contextValue}>
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
