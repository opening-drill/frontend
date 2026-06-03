import React, {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Map from "ol/Map";
import { fromLonLat } from "ol/proj";

interface MapContextProps {
  mapRef: React.MutableRefObject<Map | null>;
  coords: number[];
  setCoords: React.Dispatch<React.SetStateAction<number[]>>;
  goToLocation: (coords: number[], zoom?: number) => void;
}

const MapContext = createContext<MapContextProps | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<Map | null>(null);
  const [coords, setCoords] = useState<number[]>([34.4668, 31.5016]);

  const goToLocation = (targetCoords: number[], zoom: number = 19.5) => {
    if (mapRef.current) {
      mapRef.current.getView().animate({
        center: fromLonLat(targetCoords),
        zoom: zoom,
        duration: 2000,
      });
    }
  };

  return (
    <MapContext.Provider value={{ mapRef, coords, setCoords, goToLocation }}>
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
