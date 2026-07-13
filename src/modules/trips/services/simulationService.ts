/**
 * Simulation Service
 * Handles math for interpolating positions, calculating bearing, and generating speed variations.
 */

// Earth radius in km
const R = 6371;

export type LatLng = { lat: number; lng: number };

// Converts degrees to radians
const toRad = (value: number) => (value * Math.PI) / 180;
// Converts radians to degrees
const toDeg = (value: number) => (value * 180) / Math.PI;

/**
 * Calculates the distance between two points in kilometers using the Haversine formula.
 */
export function calculateDistance(p1: LatLng, p2: LatLng): number {
  const dLat = toRad(p2.lat - p1.lat);
  const dLon = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.lat)) *
      Math.cos(toRad(p2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates the bearing (angle in degrees) from point 1 to point 2.
 */
export function calculateBearing(start: LatLng, end: LatLng): number {
  const startLat = toRad(start.lat);
  const startLng = toRad(start.lng);
  const endLat = toRad(end.lat);
  const endLng = toRad(end.lng);

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  
  let brng = Math.atan2(y, x);
  brng = toDeg(brng);
  return (brng + 360) % 360;
}

/**
 * Interpolates a position between start and end based on a fraction (0 to 1).
 */
export function interpolatePosition(start: LatLng, end: LatLng, fraction: number): LatLng {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction,
  };
}

/**
 * Generates a jittered speed (e.g. ±5 km/h) around a base speed for realism.
 */
export function generateJitteredSpeed(baseSpeed: number = 45): number {
  const jitter = (Math.random() - 0.5) * 10; // -5 to +5
  return Math.round(baseSpeed + jitter);
}
