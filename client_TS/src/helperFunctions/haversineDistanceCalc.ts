// Haversine formula to calculate distance between two coordinates on earth
export default function haversineDistance(coord1, coord2, distanceMeasure) {
  const R = 6371e3; // Radius of Earth in meters
  const lat1 = coord1.lat * Math.PI / 180;
  const lat2 = coord2.lat * Math.PI / 180;
  const deltaLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const deltaLng = (coord2.lng - coord1.lng) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
  Math.cos(lat1) * Math.cos(lat2) *
  Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distInMeters = R * c;

  if (distanceMeasure === "km") {
    return distInMeters / 1000; //kilometers conversion
  } else if (distanceMeasure === "m") {
    return distInMeters / 1609.34 // miles conversion
  }
}