import { RoutePoint } from "../types/route";

// Haversine formula to calculate distance between two coordinates on earth
export default function haversineDistance(
  coord1: RoutePoint,
  coord2: RoutePoint,
  distanceMeasureUnit: string
): number {
  const R = 6371.009e3; // Radius of Earth in meters
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distInMeters = R * c;

  if (distanceMeasureUnit === "km") {
    return convertToKM(distInMeters); //kilometers conversion
  } else if (distanceMeasureUnit === "m") {
    return convertToM(distInMeters); // miles conversion
  }
  throw new Error("Distance Measure Unit not 'km' or 'm'");
}

function convertToKM(distInM: number) {
  return Math.round(distInM / 10) / 100; //conver to 1/100 of a km to get accuracy
}

function convertToM(distInM: number) {
  return Math.round(distInM / 16.09344) / 100; //conver to 1/100 of a m to get accuracy
}
