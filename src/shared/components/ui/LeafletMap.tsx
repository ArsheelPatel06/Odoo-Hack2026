"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const getIcons = () => {
  if (typeof window === "undefined") return null;
  return {
    originIcon: new L.DivIcon({
      html: `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    }),
    destIcon: new L.DivIcon({
      html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    }),
    truckIcon: new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097180.png",
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -19],
    })
  };
};

interface LeafletMapProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  currentPos?: { lat: number; lng: number };
  isActive: boolean;
  children?: React.ReactNode;
}

export function LeafletMap({ origin, destination, currentPos, isActive, children }: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500">Loading Map...</div>;

  const icons = getIcons();
  if (!icons) return null;
  const { originIcon, destIcon, truckIcon } = icons;

  return (
    <div className="w-full h-full relative" style={{ isolation: 'isolate' }}>
      <MapContainer 
        center={isActive && currentPos ? currentPos : origin} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        
        {/* Glow Route Line */}
        <Polyline positions={[origin, destination]} color="#4f46e5" weight={8} opacity={0.3} />
        <Polyline positions={[origin, destination]} color="#6366f1" weight={4} dashArray="10, 10" opacity={0.9} />

        {/* Origin/Dest Markers */}
        <Marker position={origin} icon={originIcon}>
          <Popup>Pickup Location</Popup>
        </Marker>
        <Marker position={destination} icon={destIcon}>
          <Popup>Dropoff Destination</Popup>
        </Marker>

        {/* Live Truck Marker */}
        {isActive && currentPos && (
          <Marker position={currentPos} icon={truckIcon} zIndexOffset={1000}>
            <Popup>Vehicle is In Transit</Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="absolute inset-0 z-[1000] pointer-events-none p-4 flex flex-col justify-between overflow-hidden">
        {children}
      </div>
    </div>
  );
}
