/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { Trip } from "@/shared/domain/models";
import { TripStatus } from "@/shared/domain/enums";
import { MapplsMap, useMapplsMap } from "@/shared/components/ui/MapplsMap";

type LiveFleetMapProps = {
  trips: Trip[];
  mapplsApiKey: string;
};

// Map centered roughly on India
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 5;

function FleetMarkers({ trips }: { trips: Trip[] }) {
  const { mapInstance, mapplsClass, isLoaded } = useMapplsMap();
  
  // We don't need state for markers, just keep them in useEffect scope since they are vanilla js objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoaded || !mapInstance || !mapplsClass) return;

    // Active trips that would have locations (mock coordinates based on index for demo)
    const activeTrips = trips.filter(t => (t.status as string) === "in_transit" || (t.status as string) === "dispatched" || t.status === TripStatus.Dispatched);

    const newMarkers = activeTrips.map((trip, idx) => {
      // Mocking latitude/longitude based on default center
      const lat = DEFAULT_CENTER.lat + (idx * 1.2 - 2);
      const lng = DEFAULT_CENTER.lng + (idx * 0.8 - 1);
      
      const isTransit = (trip.status as string) === "in_transit";
      
      // Creating an HTML element for the marker to style it similar to our old design
      const el = document.createElement('div');
      el.className = 'mappls-marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.backgroundColor = isTransit ? "#3b82f6" : "#f59e0b";
      el.style.border = `2px solid ${isTransit ? "#1d4ed8" : "#d97706"}`;
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      const marker = new mapplsClass.Marker({
        map: mapInstance,
        position: { lat, lng },
        html: el,
        width: 24,
        height: 24
      });

      return marker;
    });

    return () => {
      // Cleanup markers
      newMarkers.forEach(marker => {
        if (marker.remove) {
          marker.remove();
        }
      });
    };
  }, [trips, mapInstance, isLoaded]);

  return null;
}

export function LiveFleetMap({ trips, mapplsApiKey }: LiveFleetMapProps) {
  if (!mapplsApiKey) {
    return (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center rounded-[24px] bg-slate-100 border border-slate-200">
        <p className="text-slate-500 font-medium">Please add NEXT_PUBLIC_MAPPLS_API_KEY to your .env file</p>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[400px] w-full overflow-hidden rounded-[24px] shadow-soft border border-slate-100">
      <MapplsMap
        apiKey={mapplsApiKey}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        className="h-[600px] w-full"
      >
        <FleetMarkers trips={trips} />
      </MapplsMap>
    </div>
  );
}
