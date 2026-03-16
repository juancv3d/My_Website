import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-polylinedecorator';

interface ArrowPolylineProps {
  positions: [number, number][];
  color: string;
  dashArray?: string;
  weight?: number;
  opacity?: number;
  label?: string;
}

declare module 'leaflet' {
  function polylineDecorator(
    paths: L.Polyline | L.Polygon | L.LatLngExpression[] | L.LatLngExpression[][],
    options?: {
      patterns: {
        offset?: string | number;
        repeat: string | number;
        symbol: L.Symbol.ArrowHead | L.Symbol.Marker | L.Symbol.Dash;
      }[];
    }
  ): L.FeatureGroup;

  namespace Symbol {
    class ArrowHead {
      constructor(options?: {
        pixelSize?: number;
        polygon?: boolean;
        pathOptions?: L.PathOptions;
        headAngle?: number;
      });
    }
    class Marker {
      constructor(options?: {
        rotate?: boolean;
        markerOptions?: L.MarkerOptions;
      });
    }
    class Dash {
      constructor(options?: {
        pixelSize?: number;
        pathOptions?: L.PathOptions;
      });
    }
  }
}

export default function ArrowPolyline({
  positions,
  color,
  dashArray,
  weight = 4,
  opacity = 0.9,
  label,
}: ArrowPolylineProps) {
  const map = useMap();

  useEffect(() => {
    const polyline = L.polyline(positions, {
      color,
      dashArray,
      weight,
      opacity,
    }).addTo(map);

    if (label) {
      polyline.bindPopup(`<b>${label}</b>`);
      polyline.bindTooltip(label, { sticky: true });
    }

    const arrowColor = color;
    const decorator = L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: '15%',
          repeat: '20%',
          symbol: new L.Symbol.ArrowHead({
            pixelSize: 12,
            polygon: true,
            pathOptions: {
              color: arrowColor,
              fillColor: arrowColor,
              fillOpacity: 1,
              weight: 0,
            },
            headAngle: 45,
          }),
        },
      ],
    }).addTo(map);

    return () => {
      map.removeLayer(polyline);
      map.removeLayer(decorator);
    };
  }, [map, positions, color, dashArray, weight, opacity, label]);

  return null;
}
