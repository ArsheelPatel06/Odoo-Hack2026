"use client";

import { useEffect, useState } from "react";
import { LatLng } from "./simulationService";

export type RouteData = {
  path: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
};

export function useRouteService(origin: LatLng | null, destination: LatLng | null) {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !destination) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Using OSRM (Open Source Routing Machine) public API to get real road geometries 
    // for the demo, avoiding the need for a separate Mappls Routing API token.
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        );
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        
        if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
          throw new Error("No route found");
        }

        const route = data.routes[0];
        const coordinates = route.geometry.coordinates; // [lng, lat][]
        
        const path: LatLng[] = coordinates.map((coord: number[]) => ({
          lat: coord[1],
          lng: coord[0]
        }));

        if (isMounted) {
          setRouteData({
            path,
            distanceMeters: route.distance || 0,
            durationSeconds: route.duration || 0,
          });
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch route");
          setIsLoading(false);
        }
      }
    };

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [origin, destination]);

  return { routeData, isLoading, error };
}
