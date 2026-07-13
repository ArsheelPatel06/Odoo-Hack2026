/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { useMapplsMap } from "@/shared/components/ui/MapplsMap";
import { useRouteService } from "../../services/routeService";
import { LatLng, calculateDistance, generateJitteredSpeed, interpolatePosition, calculateBearing } from "../../services/simulationService";
// Removed AnimatedMarker import as it was deleted

// We can just define TripStats here locally since we deleted AnimatedMarker
export type MapplsTripStats = {
  id: string;
  speed: number;
  etaMinutes: number;
  distanceRemainingKm: number;
  progress: number;
};

type MapplsSimulatedTripProps = {
  id: string;
  origin: LatLng;
  destination: LatLng;
  color: string;
  onStatsUpdate: (stats: MapplsTripStats) => void;
  onArrived: (id: string) => void;
};

const DEMO_SPEED_MULTIPLIER = 10;

export function MapplsSimulatedTrip({ id, origin, destination, color, onStatsUpdate, onArrived }: MapplsSimulatedTripProps) {
  const { mapInstance, mapplsClass, isLoaded } = useMapplsMap();
  const { routeData } = useRouteService(origin, destination);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const pathIndexRef = useRef<number>(0);
  const fractionRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());

  // Render polyline when routeData is ready
  useEffect(() => {
    if (!isLoaded || !mapInstance || !mapplsClass || !routeData) return;

    // Convert routeData path to mappls format [lat, lng] array or objects
    const path = routeData.path.map(p => ({ lat: p.lat, lng: p.lng }));

    polylineRef.current = new mapplsClass.Polyline({
      map: mapInstance,
      paths: path,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 4,
      fitbounds: false
    });

    return () => {
      if (polylineRef.current && polylineRef.current.remove) {
        polylineRef.current.remove();
      }
    };
  }, [routeData, mapInstance, isLoaded, color]);

  // Handle animation
  useEffect(() => {
    if (!isLoaded || !mapInstance || !mapplsClass || !routeData || routeData.path.length < 2) return;

    const path = routeData.path;

    // Create marker element
    const el = document.createElement('div');
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    // Vehicle SVG string
    el.innerHTML = `
      <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; drop-shadow(0 4px 6px rgba(0,0,0,0.1));" id="veh-rot-${id}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" style="color:${color}">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      </div>
    `;

    markerRef.current = new mapplsClass.Marker({
      map: mapInstance,
      position: { lat: path[0].lat, lng: path[0].lng },
      html: el,
      width: 32,
      height: 32
    });

    pathIndexRef.current = 0;
    fractionRef.current = 0;
    lastTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      let idx = pathIndexRef.current;
      
      if (idx >= path.length - 1) {
        onArrived(id);
        return;
      }

      const p1 = path[idx];
      const p2 = path[idx + 1];
      
      const segmentDistKm = calculateDistance(p1, p2);
      const currentSpeedKmH = generateJitteredSpeed(40);
      const coveredKm = currentSpeedKmH * (dt / 3600) * DEMO_SPEED_MULTIPLIER;
      
      if (segmentDistKm > 0) {
        fractionRef.current += coveredKm / segmentDistKm;
      } else {
        fractionRef.current = 1;
      }

      if (fractionRef.current >= 1) {
        fractionRef.current = 0;
        pathIndexRef.current++;
        idx = pathIndexRef.current;
      }

      if (idx < path.length - 1) {
        const nextP1 = path[idx];
        const nextP2 = path[idx + 1];
        
        const newPos = interpolatePosition(nextP1, nextP2, fractionRef.current);
        const newBearing = calculateBearing(nextP1, nextP2);
        
        if (markerRef.current) {
          markerRef.current.setPosition({ lat: newPos.lat, lng: newPos.lng });
          // Rotate vehicle
          const rotContainer = document.getElementById(`veh-rot-${id}`);
          if (rotContainer) {
            rotContainer.style.transform = `rotate(${newBearing}deg)`;
          }
        }

        const distanceRemainingKm = calculateDistance(newPos, path[path.length - 1]);
        const etaMinutes = (distanceRemainingKm / currentSpeedKmH) * 60;
        const progress = 1 - (distanceRemainingKm / (routeData.distanceMeters / 1000));

        if (Math.random() < 0.1) {
          onStatsUpdate({
            id,
            speed: currentSpeedKmH,
            etaMinutes: Math.max(0, Math.round(etaMinutes)),
            distanceRemainingKm: Math.max(0, Number(distanceRemainingKm.toFixed(1))),
            progress: Math.min(1, Math.max(0, progress)),
          });
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (markerRef.current && markerRef.current.remove) {
        markerRef.current.remove();
      }
    };
  }, [routeData, mapInstance, mapplsClass, isLoaded, id, color, onArrived, onStatsUpdate]);

  return null;
}
