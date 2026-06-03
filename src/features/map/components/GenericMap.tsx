import { Box } from "@mui/material";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { fromLonLat, toLonLat } from "ol/proj";
import { XYZ } from "ol/source";
import { useEffect, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import "../index.css";
import { useMap } from "../MapProvider";
import { LOCATIONS } from "../utils/mapUtils";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { defaults as defaultInteractions } from "ol/interaction";
import type { Drone } from "../../base-ops/BaseOpsApp";
import droneIcon from "../utils/drone.png";

const useStyles = makeStyles()((theme) => ({
  mapContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    border: `1px solid ${theme.palette.divider}`,
  },
  mapTarget: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    background: "rgba(18, 24, 38, 0.8)",
    backdropFilter: "blur(8px)",
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
  },
}));

type MapProps = {
  drones: Drone[];
};

const GenericMap = ({ drones }: MapProps) => {
  const { classes } = useStyles();
  const { mapRef, setCoords } = useMap();
  const mapElement = useRef<HTMLDivElement>(null);
  const droneSourceRef = useRef<VectorSource | null>(null);

  useEffect(() => {
    if (!mapRef.current && mapElement.current) {
      const droneSource = new VectorSource({ features: [] });
      droneSourceRef.current = droneSource;

      const droneLayer = new VectorLayer({ source: droneSource });

      const map = new Map({
        target: mapElement.current,
        interactions: defaultInteractions({
          altShiftDragRotate: false,
          pinchRotate: false,
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              attributions: "© Google",
              maxZoom: 20,
            }),
          }),
          droneLayer,
        ],

        view: new View({
          center: fromLonLat(LOCATIONS.gaza.coords),
          zoom: 12,
          maxZoom: 22,
          constrainRotation: false,
        }),
      });

      map.on("moveend", () => {
        const view = map.getView();
        const center = view.getCenter();
        if (center) {
          const lonLatCoords = toLonLat(center);
          setCoords(lonLatCoords);
        }
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, [mapRef, setCoords]);

  useEffect(() => {
    if (droneSourceRef.current) {
      droneSourceRef.current.clear();

      const newFeatures = drones.map((drone) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat(drone.coords)),
          name: drone.name,
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              src: droneIcon,
              scale: 0.08,
              anchor: [0.5, 0.5],
            }),
          })
        );
        return feature;
      });

      droneSourceRef.current.addFeatures(newFeatures);
    }
  }, [drones]);

  return (
    <Box className={classes.mapContainer}>
      <div ref={mapElement} className={classes.mapTarget} />
    </Box>
  );
};

export default GenericMap;
