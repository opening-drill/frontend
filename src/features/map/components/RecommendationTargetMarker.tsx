import { useAtomValue } from 'jotai';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { useEffect, useRef } from 'react';
import { activeRecommendationCoordinatesAtom } from '../../../store/recommendationAtoms';
import { useMap } from '../MapProvider';

const targetIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42">
  <circle cx="21" cy="21" r="18" fill="rgba(255,61,0,0.14)" stroke="#ff3d00" stroke-width="2" />
  <circle cx="21" cy="21" r="6" fill="#ff3d00" stroke="#ffffff" stroke-width="2" />
  <path d="M21 3v9M21 30v9M3 21h9M30 21h9" stroke="#ff3d00" stroke-width="3" stroke-linecap="round" />
</svg>`;

const targetStyle = new Style({
  image: new Icon({
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(targetIconSvg)}`,
    anchor: [0.5, 0.5],
    scale: 1,
  }),
});

export const RecommendationTargetMarker = () => {
  const coordinates = useAtomValue(activeRecommendationCoordinatesAtom);
  const { mapRef } = useMap();
  const sourceRef = useRef<VectorSource | null>(null);
  const featureRef = useRef<Feature<Point> | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = new VectorSource();
    const layer = new VectorLayer({
      source,
      zIndex: 160,
    });

    sourceRef.current = source;
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
      sourceRef.current = null;
      featureRef.current = null;
    };
  }, [mapRef]);

  useEffect(() => {
    const source = sourceRef.current;
    const map = mapRef.current;
    if (!source || !map) return;

    if (!coordinates) {
      source.clear();
      featureRef.current = null;
      return;
    }

    const projectedCoordinates = fromLonLat(coordinates);

    if (featureRef.current) {
      featureRef.current.getGeometry()?.setCoordinates(projectedCoordinates);
    } else {
      const feature = new Feature({
        geometry: new Point(projectedCoordinates),
      });
      feature.setStyle(targetStyle);
      featureRef.current = feature;
      source.addFeature(feature);
    }

    map.getView().animate({
      center: projectedCoordinates,
      duration: 250,
      zoom: Math.max(map.getView().getZoom() ?? 12, 13),
    });
  }, [coordinates, mapRef]);

  return null;
};
