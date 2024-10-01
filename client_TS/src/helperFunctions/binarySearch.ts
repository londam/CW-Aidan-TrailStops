//!! not needed any longer

import { RoutePoint } from "../types/route";

export default function binarySearch(
  sortedRoute: RoutePoint[],
  { lat: targetLat, lng: targetLon }: RoutePoint
): [number] | [number, number] {
  let low: number = 0;
  let high: number = sortedRoute.length - 1;

  // Check for edge cases where the target is outside the route bounds
  if (targetLon <= sortedRoute[low].lng) {
    //return lowest point index
    return [low];
  } else if (targetLon >= sortedRoute[high].lng) {
    // return sortedRoute[high];
    //return highest point index
    return [high];
  }

  // Binary search to find the closest two points by longitude
  while (low <= high) {
    let mid: number = Math.floor((low + high) / 2);

    if (sortedRoute[mid].lng === targetLon) {
      // If an exact match by longitude is found, return the closest latitude point index
      // return sortedRoute[mid];
      return [mid];
    } else if (sortedRoute[mid].lng < targetLon) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // At this point, low and high are the closest surrounding indices by longitude.
  // `high` is the smallest longitude smaller than `targetLon`
  // `low` is the largest longitude larger than `targetLon`

  // Now, compare latitudes between these two points to the target latitude
  const distLow: number = Math.abs(sortedRoute[low].lat - targetLat);
  const distHigh: number = Math.abs(sortedRoute[high].lat - targetLat);

  // If the two longitudes are close, we may want to check which of the points is closer by latitude.
  if (distLow < distHigh) {
    return [low]; // Return low, low is closer in latitude
  } else {
    return [high]; // Return high, high is closer in latitude
  }

  //we're returning two indices of those two points normally, but in edge cases (above) we return only one index
  return [low, high];
}
