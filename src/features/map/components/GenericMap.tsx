import { Box } from "@mui/material";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { XYZ } from "ol/source";
import { useEffect, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import { useAtomValue } from "jotai";
import { aircraftsAtom } from "../../../store/aircraftAtoms";
import type { AircraftLive } from "../../../types/aircraft";
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

// Generates a premium styled aircraft marker styled by status and rotated by heading_degrees
const getAircraftStyle = (aircraft: AircraftLive): Style => {
  let color = '#10b981'; // free (emerald/teal)
  if (aircraft.status === 'busy') {
    color = '#f59e0b'; // busy (amber/orange)
  } else if (aircraft.status === 'broken') {
    color = '#ef4444'; // broken (coral/red)
  }

  // Sleek military/tactical UAV/drone SVG icon pointing North (0 degrees)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="15" stroke="${color}" stroke-opacity="0.3" stroke-width="1.5" fill="${color}" fill-opacity="0.1"/>
      <path d="M18 6 L12 28 L18 23 L24 28 Z" fill="${color}" stroke="#1e293b" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M18 6 L18 13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `;

  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  const rotationRad = (aircraft.heading_degrees * Math.PI) / 180;

  return new Style({
    image: new Icon({
      src: svgDataUri,
      scale: 1.0,
      rotation: rotationRad,
      anchor: [0.5, 0.5],
    }),
    text: new Text({
      text: `${aircraft.aircraft_type}\n(${aircraft.altitude}m | ${aircraft.horizontal_speed_mps}m/s)`,
      font: 'bold 11px Inter, Roboto, Helvetica Neue, sans-serif',
      fill: new Fill({
        color: '#ffffff',
      }),
      stroke: new Stroke({
        color: 'rgba(18, 24, 38, 0.85)',
        width: 3.5,
      }),
      offsetY: 28,
    }),
  });
};

const GenericMap = () => {
  const { classes } = useStyles();
  const { mapRef } = useMap();
  const mapElement = useRef<HTMLDivElement>(null);
  
  // Keep track of the aircraft vector source
  const aircraftSourceRef = useRef<VectorSource | null>(null);

  useEffect(() => {
    if (!mapRef.current && mapElement.current) {
      const aircraftSource = new VectorSource();
      const aircraftLayer = new VectorLayer({
        source: aircraftSource,
        zIndex: 100, // Display above base tile layer
      });

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
          aircraftLayer,
        ],
        view: new View({
          center: fromLonLat(LOCATIONS.gaza.coords),
          zoom: 12,
          constrainRotation: false,
        }),
      });

      aircraftSourceRef.current = aircraftSource;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
      aircraftSourceRef.current = null;
    };
  }, [mapRef]);

  // Synchronize aircraft state from Jotai with OpenLayers features
  const aircrafts = useAtomValue(aircraftsAtom);

  useEffect(() => {
    const source = aircraftSourceRef.current;
    if (!source) return;

    const existingFeatures = source.getFeatures();
    const existingMap: Record<string, Feature> = {};
    existingFeatures.forEach((feature) => {
      const id = feature.getId() as string;
      if (id) {
        existingMap[id] = feature;
      }
    });

    const activeIds = new Set(Object.keys(aircrafts));

    // 1. Remove features for aircrafts that are no longer active
    Object.keys(existingMap).forEach((id) => {
      if (!activeIds.has(id)) {
        source.removeFeature(existingMap[id]);
      }
    });

    // 2. Add or update features for active aircrafts
    Object.values(aircrafts).forEach((aircraft) => {
      // Coordinate validity guardrail
      if (
        !aircraft.location ||
        typeof aircraft.location.lng !== "number" ||
        typeof aircraft.location.lat !== "number" ||
        isNaN(aircraft.location.lng) ||
        isNaN(aircraft.location.lat)
      ) {
        return;
      }

      const feature = existingMap[aircraft.aircraft_id];
      const coords = fromLonLat([aircraft.location.lng, aircraft.location.lat]);

      if (feature) {
        // Update geometry in-place
        const geom = feature.getGeometry() as Point;
        if (geom) {
          geom.setCoordinates(coords);
        }
        // Update properties, styles, and orientation
        feature.setProperties(aircraft);
        feature.setStyle(getAircraftStyle(aircraft));
      } else {
        // Create a new feature for the new aircraft
        const newFeature = new Feature({
          geometry: new Point(coords),
        });
        newFeature.setId(aircraft.aircraft_id);
        newFeature.setProperties(aircraft);
        newFeature.setStyle(getAircraftStyle(aircraft));
        source.addFeature(newFeature);
      }
    });
  }, [aircrafts]);

  return (
    <Box className={classes.mapContainer}>
      <div ref={mapElement} className={classes.mapTarget} />
    </Box>
  );
};

export default GenericMap;
