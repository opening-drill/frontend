import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const useStyles = makeStyles()((theme) => ({
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
  },
  mapTarget: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    background: 'rgba(18, 24, 38, 0.8)',
    backdropFilter: 'blur(8px)',
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
  }
}));

export const GenericMap: React.FC = () => {
  const { classes } = useStyles();
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <Box className={classes.mapContainer}>
      <Box className={classes.overlay}>
        <Typography variant="subtitle2" color="primary">Tactical Map Online</Typography>
      </Box>
      <div ref={mapElement} className={classes.mapTarget} />
    </Box>
  );
};
