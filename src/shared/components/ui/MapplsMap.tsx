/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
// Remove global declaration to avoid collision with imported mappls

interface MapplsMapContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapInstance: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapplsClass: any | null;
  isLoaded: boolean;
}

const MapplsMapContext = createContext<MapplsMapContextType>({ mapInstance: null, mapplsClass: null, isLoaded: false });

export const useMapplsMap = () => useContext(MapplsMapContext);

interface MapplsMapProps {
  apiKey: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  className?: string;
  children?: React.ReactNode;
}

export function MapplsMap({
  apiKey,
  defaultCenter = { lat: 20.5937, lng: 78.9629 }, // Default to India center
  defaultZoom = 5,
  className = "w-full h-full",
  children
}: MapplsMapProps) {
  const mapContainerId = useRef(`mappls-map-${Math.random().toString(36).substr(2, 9)}`).current;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapplsClass, setMapplsClass] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;

    const currentContainer = mapContainerRef.current;
    
    const initMap = async () => {
      if (!currentContainer) return;
      
      try {
        const { mappls } = await import("mappls-web-maps");
        const mapplsPlug = new mappls();
        
        setMapplsClass(mapplsPlug);
        
        console.log("Calling mapplsPlug.initialize...");
        
        // Add a timeout to catch silent failures
        const timeoutId = setTimeout(() => {
          if (!isLoaded) {
            console.error("Mappls SDK initialization timed out. The API key might be invalid or unauthorized.");
            if (currentContainer) {
              currentContainer.innerHTML = `
                <div class="flex h-full w-full flex-col items-center justify-center bg-red-50 text-center p-4">
                  <p class="text-red-600 font-medium text-sm">Failed to load MapmyIndia SDK.</p>
                  <p class="text-red-500 text-xs mt-1">Please check your API key and domain whitelist in the Mappls console.</p>
                </div>
              `;
            }
          }
        }, 5000);

        mapplsPlug.initialize(apiKey, { map: true }, () => {
          clearTimeout(timeoutId);
          console.log("Mappls initialized callback fired!");
          try {
            map = mapplsPlug.Map({
              id: mapContainerId,
              properties: {
                center: [defaultCenter.lat, defaultCenter.lng], // Note: lat, lng order
                zoom: defaultZoom,
              }
            });
            setMapInstance(map);
            setIsLoaded(true);
          } catch(e) {
            console.error("Failed to initialize Mappls Map", e);
          }
        });
      } catch (err) {
        console.error("Error importing mappls-web-maps:", err);
      }
    };

    initMap();

    return () => {
      if (map) {
        if (currentContainer) {
          currentContainer.innerHTML = "";
        }
      }
    };
  }, [apiKey, defaultCenter.lat, defaultCenter.lng, defaultZoom, mapContainerId, isLoaded]);

  return (
    <MapplsMapContext.Provider value={{ mapInstance, mapplsClass, isLoaded }}>
      <div className={`relative w-full h-full min-h-[400px] ${className}`} style={{ minHeight: '100%', width: '100%' }}>
        <div id={mapContainerId} ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%', height: '100%', minHeight: '400px' }} />
        <div className="absolute inset-0 pointer-events-none">
          {isLoaded && children}
        </div>
      </div>
    </MapplsMapContext.Provider>
  );
}
