import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Plus, Minus } from 'lucide-react';

export interface MapMarker {
  id?: string | number;
  lat: number;
  lng: number;
  label: string;
  isCurrent: boolean;
}

interface SimpleMapProps {
  center: { lat: number, lng: number };
  markers?: MapMarker[];
  fitBounds?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ center, markers = [], fitBounds = true, onMarkerClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([center.lat, center.lng], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstanceRef.current);

      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }
  }, []);

  // Update View and Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    // Clear old markers
    layerGroupRef.current.clearLayers();

    const allMarkers = markers.length > 0 ? markers : [{ lat: center.lat, lng: center.lng, label: 'Current', isCurrent: true }];

    allMarkers.forEach(m => {
        const color = m.isCurrent ? '#0EA5E9' : '#475569'; 
        const strokeColor = '#0F172A'; 
        const zIndex = m.isCurrent ? 1000 : 500;
        const size = m.isCurrent ? 42 : 30;

        const svgIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `
            <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));">
                <svg viewBox="0 0 24 24" fill="${color}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin" style="width: 100%; height: 100%;">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3" fill="white"></circle>
                </svg>
                ${m.isCurrent ? '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; background: ' + color + '; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
            </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size/2, size],
            popupAnchor: [0, -size]
        });

        const marker = L.marker([m.lat, m.lng], { icon: svgIcon, zIndexOffset: zIndex })
            .bindPopup(`<div style="font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.4; color: #f1f5f9; font-weight: 600;">${m.label}</div>`, { 
              closeButton: false,
              autoClose: false,
              closeOnClick: false,
              className: 'custom-dark-popup'
            });
        
        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(m);
          }
        });

        layerGroupRef.current?.addLayer(marker);

        if(m.isCurrent && !fitBounds) {
            marker.openPopup();
        }
    });

    if (fitBounds && allMarkers.length > 0) {
      const bounds = L.latLngBounds(allMarkers.map(m => [m.lat, m.lng]));
      
      // If only one marker, fitBounds might zoom too much. 
      // We check if bounds are a single point.
      if (allMarkers.length === 1) {
        mapInstanceRef.current.setView([allMarkers[0].lat, allMarkers[0].lng], 13, { animate: true });
      } else {
        mapInstanceRef.current.fitBounds(bounds, { 
          padding: [40, 40], 
          animate: true,
          maxZoom: 15 // Prevent extreme zoom-ins on close clusters
        });
      }
    } else {
      mapInstanceRef.current.setView([center.lat, center.lng], 12, { animate: true });
    }

  }, [center, markers, fitBounds, onMarkerClick]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-white/10 relative bg-white group shadow-inner">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-white" />
      
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur border border-white/10 px-3 py-1.5 rounded text-[10px] font-mono text-primary-400 tracking-widest uppercase shadow-lg">
        Live Map View
      </div>

      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <button 
            onClick={handleZoomIn}
            className="p-2 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            aria-label="Zoom In"
        >
            <Plus className="h-5 w-5" />
        </button>
        <button 
            onClick={handleZoomOut}
            className="p-2 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            aria-label="Zoom Out"
        >
            <Minus className="h-5 w-5" />
        </button>
      </div>
      
      <style>{`
        @keyframes ping {
            75%, 100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        .custom-dark-popup .leaflet-popup-content-wrapper {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(56, 189, 248, 0.3);
            color: #e2e8f0;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .custom-dark-popup .leaflet-popup-tip {
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(56, 189, 248, 0.3);
            border-top: none;
            border-left: none;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8;
        }
        .leaflet-popup-content {
          margin: 10px 14px;
        }
      `}</style>
    </div>
  );
};

export default SimpleMap;