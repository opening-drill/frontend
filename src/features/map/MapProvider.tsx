import Map from "ol/Map";
import { fromLonLat } from "ol/proj";
import React, {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

interface MapContextProps {
  mapRef: React.MutableRefObject<Map | null>;
  goToLocation: (coords: number[], zoom?: number, heading?: number) => void
}

const MapContext = createContext<MapContextProps | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapRef = useRef<Map | null>(null);

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
