import binarySearch from "./binarySearch";
import { routeData } from "../routeData";
import placeMarkerBetweenPoints from "./placeMarkerBetweenPoints";
//TODO Make the line more accurate on the longitude

// Function to find the two closest points on the route to the clicked point
function closestPoints(pointCoords: number[]) {
  // Sort the route by longitude
  let sortedRoute: number[][] = routeData.coordinates.slice().sort((a, b) => a[1] - b[1]);

  const [targetLon, targetLat]: number[] = pointCoords;
  const [low, high]: number[] = binarySearch(sortedRoute, targetLon);

  // After binary search, low and high should be the indices of the closest two points by longitude
  const lowerPoint: number[] = sortedRoute[high];
  const higherPoint: number[] = sortedRoute[low];

  // find the point the click would be closest to on a line between the two closest points
  const closestLinePoint: number[] = placeMarkerBetweenPoints(
    [targetLat, targetLon],
    lowerPoint,
    higherPoint
  );

  // Calculate the distances from the target point to the closestLinePoint, lowerPoint, and higherPoint
  const distanceToLower: number = Math.hypot(lowerPoint[0] - targetLat, lowerPoint[1] - targetLon);
  const distanceToHigher: number = Math.hypot(
    higherPoint[0] - targetLat,
    higherPoint[1] - targetLon
  );
  const distanceToProjection: number = Math.hypot(
    closestLinePoint[0] - targetLat,
    closestLinePoint[1] - targetLon
  );

  // Return the closest point: either the closestLinePoint or one of the two points
  if (distanceToProjection < Math.min(distanceToLower, distanceToHigher)) {
    return closestLinePoint;
  } else {
    return distanceToLower < distanceToHigher ? lowerPoint : higherPoint;
  }
}

export default closestPoints;
