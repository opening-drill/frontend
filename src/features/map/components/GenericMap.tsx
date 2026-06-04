import BrushIcon from "@mui/icons-material/Brush";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CrosshairIcon from "@mui/icons-material/MyLocation";
import PentagonIcon from "@mui/icons-material/Pentagon";
import { defaults as defaultInteractions, Draw } from "ol/interaction";
import PlaceIcon from "@mui/icons-material/Place";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { fromLonLat, toLonLat } from "ol/proj";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import { useAtomValue } from "jotai"; // Assuming Jotai is used based on your code

// Adjust these relative imports according to your actual folder structure
import type { Drone } from "../../base-ops/BaseOpsApp";
import droneIcon from "../utils/drone.png";
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style";
import Text from "ol/style/Text";
import { useCallback, useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { useMap } from "../MapProvider";
import "../index.css";
import { LOCATIONS } from "../utils/mapUtils";
import type { AircraftLive } from "../../../types/aircraft";
import { aircraftsAtom } from "../../../store/aircraftAtoms";

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
  drawingToolbar: {
    position: "absolute",
    bottom: 80,
    right: 16,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    background: "rgba(18, 24, 38, 0.85)",
    backdropFilter: "blur(16px)",
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    width: 220,
  },
  attackPopupOverlay: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    background: "rgba(20, 20, 25, 0.98)",
    backdropFilter: "blur(16px)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 61, 0, 0.5)",
    boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.6)",
    width: 200,
    color: "#fff",
    position: "absolute",
    zIndex: 2000,
    transform: "translate(-50%, -100%)",
    pointerEvents: "auto",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-8px",
      left: "50%",
      transform: "translateX(-50%)",
      borderWidth: "8px 8px 0",
      borderStyle: "solid",
      borderColor: "rgba(20, 20, 25, 0.98) transparent transparent",
    },
  },
  toolbarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  toolbarTitle: {
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    color: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  closeButton: {
    color: "rgba(255, 255, 255, 0.4)",
    padding: 2,
    "&:hover": {
      color: "#fff",
      background: "rgba(255, 255, 255, 0.08)",
    },
  },
  toggleButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 1000,
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "rgba(18, 24, 38, 0.85)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#00e5ff",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      background: "#00e5ff",
      color: "#121826",
      transform: "scale(1.05)",
    },
  },
  attackModeButton: {
    position: "absolute",
    bottom: 76,
    right: 16,
    zIndex: 1000,
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "rgba(18, 24, 38, 0.85)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#ff3d00",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      background: "#ff3d00",
      color: "#fff",
      transform: "scale(1.05)",
    },
  },
  toolGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: theme.spacing(0.75),
  },
  toolButton: {
    minWidth: 0,
    height: 40,
    borderRadius: theme.shape.borderRadius,
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    color: "rgba(255, 255, 255, 0.7)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.08)",
      color: "#fff",
      borderColor: "rgba(255, 255, 255, 0.15)",
    },
  },
  colorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(1),
    background: "rgba(255, 255, 255, 0.02)",
    padding: theme.spacing(0.75, 1.25),
    borderRadius: theme.shape.borderRadius,
    border: "1px solid rgba(255, 255, 255, 0.03)",
  },
  colorLabel: {
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.5)",
  },
  colorList: {
    display: "flex",
    gap: theme.spacing(0.75),
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "transform 0.15s ease, border-color 0.15s ease",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  activeColorDot: {
    borderColor: "#fff",
    transform: "scale(1.1)",
  },
  clearButton: {
    borderRadius: theme.shape.borderRadius,
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.85rem",
    padding: theme.spacing(0.75),
    borderColor: "rgba(244, 67, 54, 0.3)",
    color: "rgba(244, 67, 54, 0.85)",
    background: "rgba(244, 67, 54, 0.03)",
    "&:hover": {
      borderColor: "#f44336",
      color: "#fff",
      background: "rgba(244, 67, 54, 0.15)",
    },
  },
  fireActionBtn: {
    background: "#ff3d00",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.8rem",
    "&:hover": {
      background: "#dd2c00",
      boxShadow: "0 0 15px rgba(255, 61, 0, 0.4)",
    },
  },
  coordContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    padding: "8px",
    borderRadius: "8px",
    margin: "4px 0",
    border: "1px solid rgba(255,255,255,0.1)",
  },
}));

type MapProps = {
  drones?: Drone[];
};

type DrawType = "Polygon" | "LineString" | "Point" | "Circle";

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const targetIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="3" fill="#ff3d00" />
  <path fill="none" stroke="#ff3d00" stroke-width="2" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
  <circle cx="12" cy="12" r="8" fill="none" stroke="#ff3d00" stroke-width="1.5" stroke-dasharray="2 1" />
</svg>`;

const getFeatureStyle = (color: string, isAttack = false) => {
  if (isAttack) {
    return new Style({
      image: new Icon({
        src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          targetIconSvg
        )}`,
        anchor: [0.5, 0.5],
        scale: 1,
      }),
    });
  }

  return new Style({
    fill: new Fill({ color: hexToRgba(color, 0.25) }),
    stroke: new Stroke({ color: color, width: 3 }),
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color: color }),
      stroke: new Stroke({ color: "#ffffff", width: 2 }),
    }),
  });
};

const getAircraftStyle = (aircraft: AircraftLive): Style => {
  let color = "#10b981"; // free
  if (aircraft.status === "busy") {
    color = "#f59e0b"; // busy
  } else if (aircraft.status === "broken") {
    color = "#ef4444"; // broken
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="15" stroke="${color}" stroke-opacity="0.3" stroke-width="1.5" fill="${color}" fill-opacity="0.1"/>
      <path d="M18 6 L12 28 L18 23 L24 28 Z" fill="${color}" stroke="#1e293b" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M18 6 L18 13" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

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
      font: "bold 11px Inter, Roboto, Helvetica Neue, sans-serif",
      fill: new Fill({ color: "#ffffff" }),
      stroke: new Stroke({ color: "rgba(18, 24, 38, 0.85)", width: 3.5 }),
      offsetY: 28,
    }),
  });
};

const GenericMap = ({ drones = [] }: MapProps) => {
  const { classes } = useStyles();
  const { mapRef, setCoords } = useMap();
  const mapElement = useRef<HTMLDivElement>(null);

  // Source refs
  const aircraftSourceRef = useRef<VectorSource | null>(null);
  const droneSourceRef = useRef<VectorSource | null>(null);
  const drawingSourceRef = useRef<VectorSource | null>(null);

  const drawingLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);

  // State
  const [activeTool, setActiveTool] = useState<DrawType | null>(null);
  const [activeColor, setActiveColor] = useState<string>("#00e5ff");
  const [isToolbarOpen, setIsToolbarOpen] = useState<boolean>(false);
  const [isAttackModeActive, setIsAttackModeActive] = useState<boolean>(false);
  const [attackCoords, setAttackCoords] = useState<{
    lat: string;
    lon: string;
  } | null>(null);
  const [selectedAttackFeature, setSelectedAttackFeature] =
    useState<Feature | null>(null);

  // Map sync refs
  const geoCoordsRef = useRef<number[] | null>(null);
  const [popupPixelPos, setPopupPixelPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const displayPopupAtCoordinates = useCallback(
    (coordinates: number[], feature: Feature) => {
      const lonLat = toLonLat(coordinates);
      setSelectedAttackFeature(feature);
      setAttackCoords({
        lon: lonLat[0].toFixed(5),
        lat: lonLat[1].toFixed(5),
      });

      geoCoordsRef.current = coordinates;

      if (mapRef.current) {
        const pixel = mapRef.current.getPixelFromCoordinate(coordinates);
        if (pixel) {
          setPopupPixelPos((prev) => {
            const next = { x: pixel[0], y: pixel[1] - 12 };
            return prev && prev.x === next.x && prev.y === next.y ? prev : next;
          });
        }
      }
    },
    [mapRef],
  );

  useEffect(() => {
    if (!mapElement.current || mapRef.current) return;

    // 1. Setup Sources
    const aircraftSource = new VectorSource();
    const droneSource = new VectorSource({ features: [] });
    const drawingSource = new VectorSource({ wrapX: false });

    aircraftSourceRef.current = aircraftSource;
    droneSourceRef.current = droneSource;
    drawingSourceRef.current = drawingSource;

    // 2. Setup Layers
    const aircraftLayer = new VectorLayer({
      source: aircraftSource,
      zIndex: 100,
    });
    const droneLayer = new VectorLayer({ source: droneSource, zIndex: 90 });

    const drawingLayer = new VectorLayer({
      source: drawingSource,
      zIndex: 110,
      style: (feature) => {
        const color = feature.get("color") || "#00e5ff";
        const isAttack = feature.get("isAttack") || false;
        return getFeatureStyle(color, isAttack);
      },
    });
    drawingLayerRef.current = drawingLayer;

    // 3. Initialize Map Instance
    const mapInstance = new Map({
      target: mapElement.current,
      interactions: defaultInteractions({
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            maxZoom: 20,
          }),
        }),
        drawingLayer, // Drawings go underneath popups but above other vectors
        droneLayer,
        aircraftLayer,
      ],
      view: new View({
        center: fromLonLat(LOCATIONS.gaza.coords),
        zoom: 12,
        maxZoom: 22,
        constrainRotation: false,
      }),
      controls: []
    });

    // 4. Setup Event Listeners
    const syncPixelPosition = () => {
      if (geoCoordsRef.current) {
        const pixel = mapInstance.getPixelFromCoordinate(geoCoordsRef.current);
        if (pixel) {
          setPopupPixelPos((prev) => {
            const next = { x: pixel[0], y: pixel[1] - 12 };
            return prev && prev.x === next.x && prev.y === next.y ? prev : next;
          });
        }
      }
    };

    mapInstance.on("moveend", () => {
      const view = mapInstance.getView();
      const center = view.getCenter();
      if (center) {
        const lonLatCoords = toLonLat(center);
        setCoords(lonLatCoords);
      }
      syncPixelPosition();
    });

    mapInstance.on("postrender", syncPixelPosition);

    mapInstance.on("click", (evt) => {
      if (drawInteractionRef.current) return;

      const feature = mapInstance.forEachFeatureAtPixel(
        evt.pixel,
        (feat) => feat,
        { hitTolerance: 8 }
      );

      if (feature && feature.get("isAttack")) {
        const geom = feature.getGeometry();
        if (geom && geom.getType() === "Point") {
          // Fixed point geometry type casting
          const pointGeom = geom as Point;
          displayPopupAtCoordinates(
            pointGeom.getCoordinates(),
            feature as Feature
          );
        }
      } else {
        setAttackCoords(null);
        geoCoordsRef.current = null;
        setPopupPixelPos(null);
      }
    });

    // 5. Store globally
    mapRef.current = mapInstance;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
      aircraftSourceRef.current = null;
      droneSourceRef.current = null;
      drawingSourceRef.current = null;
    };
  }, [displayPopupAtCoordinates, mapRef, setCoords]);

  // Sync Drones
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

  // Interaction Lifecycle
  useEffect(() => {
    const map = mapRef.current;
    const source = drawingSourceRef.current;

    if (!map || !source) return;

    if (drawInteractionRef.current) {
      map.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    if (isAttackModeActive) {
      setIsToolbarOpen(false);

      const attackDraw = new Draw({
        source: source,
        type: "Point",
        style: getFeatureStyle("#ff3d00", true),
      });

      attackDraw.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        if (geometry && geometry.getType() === "Point") {
          const coordinates = (geometry as Point).getCoordinates();
          event.feature.set("isAttack", true);

          displayPopupAtCoordinates(coordinates, event.feature);
          setIsAttackModeActive(false);
        }
      });

      map.addInteraction(attackDraw);
      drawInteractionRef.current = attackDraw;
    } else if (activeTool && isToolbarOpen) {
      const draw = new Draw({
        source: source,
        type: activeTool,
        style: getFeatureStyle(activeColor, false),
      });

      draw.on("drawend", (event) => {
        event.feature.set("color", activeColor);
      });

      map.addInteraction(draw);
      drawInteractionRef.current = draw;
    }

    return () => {
      if (map && drawInteractionRef.current) {
        map.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
    };
  }, [
    activeTool,
    activeColor,
    isToolbarOpen,
    isAttackModeActive,
    mapRef,
    displayPopupAtCoordinates,
  ]);

  const handleClear = () => {
    if (drawingSourceRef.current) {
      drawingSourceRef.current.clear();
      handleClosePopupOnly();
      setSelectedAttackFeature(null);
    }
  };

  const handleClosePopupOnly = () => {
    setAttackCoords(null);
    geoCoordsRef.current = null;
    setPopupPixelPos(null);
  };

  const handleRemoveAttackPoint = () => {
    if (selectedAttackFeature && drawingSourceRef.current) {
      drawingSourceRef.current.removeFeature(selectedAttackFeature);
    }
    handleClosePopupOnly();
    setSelectedAttackFeature(null);
  };

  const handleAttackConfirm = () => {
    if (attackCoords) {
      alert(
        `מבצע תקיפה לקואורדינטות: ${attackCoords.lat}, ${attackCoords.lon}`
      );
    }
  };

  const tools = [
    {
      type: "Polygon" as DrawType,
      label: "פוליגון",
      icon: <PentagonIcon fontSize="small" />,
    },
    {
      type: "LineString" as DrawType,
      label: "קו",
      icon: <TimelineIcon fontSize="small" />,
    },
    {
      type: "Point" as DrawType,
      label: "נקודה",
      icon: <PlaceIcon fontSize="small" />,
    },
    {
      type: "Circle" as DrawType,
      label: "מעגל",
      icon: <RadioButtonUncheckedIcon fontSize="small" />,
    },
  ];

  // Sync Aircrafts
  const aircrafts = useAtomValue(aircraftsAtom);

  useEffect(() => {
    const source = aircraftSourceRef.current;
    if (!source || !aircrafts) return;

    const existingFeatures = source.getFeatures();
    const existingMap: Record<string, Feature> = {};
    existingFeatures.forEach((feature) => {
      const id = feature.getId() as string;
      if (id) {
        existingMap[id] = feature;
      }
    });

    const activeIds = new Set(Object.keys(aircrafts));

    // 1. Remove obsolete features
    Object.keys(existingMap).forEach((id) => {
      if (!activeIds.has(id)) {
        source.removeFeature(existingMap[id]);
      }
    });

    // 2. Add or update active features
    Object.values(aircrafts).forEach((aircraft) => {
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
        const geom = feature.getGeometry() as Point;
        if (geom) geom.setCoordinates(coords);
        feature.setProperties(aircraft);
        feature.setStyle(getAircraftStyle(aircraft));
      } else {
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

      <Tooltip
        title={isAttackModeActive ? "בטל בחירת מטרה" : "סמן נקודת תקיפה"}
        arrow
        placement="left"
      >
        <IconButton
          className={classes.attackModeButton}
          onClick={() => setIsAttackModeActive(!isAttackModeActive)}
          style={
            isAttackModeActive ? { background: "#ff3d00", color: "#fff" } : {}
          }
        >
          <LocalFireDepartmentIcon />
        </IconButton>
      </Tooltip>

      <Tooltip
        title={isToolbarOpen ? "סגור כלי ציור" : "כלי ציור במפה"}
        arrow
        placement="left"
      >
        <IconButton
          className={classes.toggleButton}
          onClick={() => setIsToolbarOpen(!isToolbarOpen)}
          style={
            isToolbarOpen ? { background: "#00e5ff", color: "#121826" } : {}
          }
        >
          {isToolbarOpen ? <CloseIcon /> : <CreateIcon />}
        </IconButton>
      </Tooltip>

      {attackCoords && popupPixelPos && (
        <div
          className={classes.attackPopupOverlay}
          dir="rtl"
          style={{
            left: `${popupPixelPos.x}px`,
            top: `${popupPixelPos.y}px`,
          }}
        >
          <Box className={classes.toolbarHeader}>
            <Typography
              variant="subtitle2"
              className={classes.toolbarTitle}
              style={{ color: "#ff8a80" }}
            >
              <CrosshairIcon sx={{ fontSize: 14 }} />
              יעד תקיפה
            </Typography>
            <IconButton
              className={classes.closeButton}
              size="small"
              onClick={handleClosePopupOnly}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          <Box className={classes.coordContainer}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "#00e5ff",
              }}
            >
              LAT: {attackCoords.lat}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "#00e5ff",
              }}
            >
              LON: {attackCoords.lon}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            className={classes.fireActionBtn}
            onClick={handleAttackConfirm}
            fullWidth
          >
            אישור תקיפה
          </Button>

          <Button
            variant="text"
            size="small"
            sx={{
              color: "rgba(255,255,255,0.4)",
              mt: 0.5,
              textTransform: "none",
              fontSize: "0.7rem",
              "&:hover": { color: "#ff3d00" },
            }}
            onClick={handleRemoveAttackPoint}
            fullWidth
          >
            הסר נקודה
          </Button>
        </div>
      )}

      {isToolbarOpen && (
        <Box className={classes.drawingToolbar} dir="rtl">
          <Box className={classes.toolbarHeader}>
            <Typography variant="subtitle2" className={classes.toolbarTitle}>
              <BrushIcon sx={{ fontSize: 16 }} />
              כלי ציור במפה
            </Typography>
            <IconButton
              className={classes.closeButton}
              size="small"
              onClick={() => setIsToolbarOpen(false)}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Box className={classes.toolGrid}>
            {tools.map((tool) => (
              <Tooltip
                key={tool.type}
                title={`${tool.label}`}
                arrow
                placement="top"
              >
                <IconButton
                  className={classes.toolButton}
                  style={
                    activeTool === tool.type
                      ? {
                          background: hexToRgba(activeColor, 0.15),
                          border: `1px solid ${activeColor}`,
                          color: activeColor,
                        }
                      : {}
                  }
                  onClick={() =>
                    setActiveTool(activeTool === tool.type ? null : tool.type)
                  }
                >
                  {tool.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>

          <Box className={classes.colorContainer}>
            <Typography className={classes.colorLabel}>צבע:</Typography>
            <Box className={classes.colorList}>
              {[
                { hex: "#00e5ff", name: "cyan" },
                { hex: "#d500f9", name: "purple" },
                { hex: "#00e676", name: "green" },
                { hex: "#ffea00", name: "yellow" },
              ].map((color) => (
                <Box
                  key={color.hex}
                  className={`${classes.colorDot} ${
                    activeColor === color.hex ? classes.activeColorDot : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setActiveColor(color.hex)}
                />
              ))}
            </Box>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            className={classes.clearButton}
            onClick={handleClear}
            fullWidth
          >
            נקה הכל
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GenericMap;
