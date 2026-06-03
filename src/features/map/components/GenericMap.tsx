import { Box } from "@mui/material";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { XYZ } from "ol/source";
import { useEffect, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import "../index.css";
import { useMap } from "../MapProvider";
import { LOCATIONS } from "../utils/mapUtils";

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

const GenericMap = () => {
  const { classes } = useStyles();
  const { mapRef } = useMap();
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current && mapElement.current) {
      mapRef.current = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
              attributions: "© Google",
              maxZoom: 20,
            }),
          }),
        ],
        view: new View({
          center: fromLonLat(LOCATIONS.gaza.coords),
          zoom: 12,
          constrainRotation: false,
        }),
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, [mapRef]);

  return (
    <Box className={classes.mapContainer}>
      <div ref={mapElement} className={classes.mapTarget} />
    </Box>
  );
};

export default GenericMap;
