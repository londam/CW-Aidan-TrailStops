import binarySearch from "./binarySearch";
import { RoutePoint } from "../types/route";
import placeMarkerBetweenPoints from "./placeMarkerBetweenPoints";
import { buildKDTree, KDTreeNode, nearestNeighbor } from "./kdTree";
import { gpxRouteData } from "../data/hikingRoutes/gpxRouteDataLong";
import { gpxRouteTree } from "../data/hikingRoutes/gpxRouteTreeLongGPX";
import createGPXArray from "./createGPXArray";

//TODO Make the line more accurate on the longitude

// Function to find the two closest points on the route to the clicked point
async function closestPoints(pointCoords: RoutePoint) {
  // Sort the route by longitude

  // !! This is not needed since kdTree is already strucuted and saved into .ts as json
  // // const route: RoutePoint[] = routeData.coordinates.map((a) => ({ lat: a[1], lng: a[0] })); // !! wrong order in routeData.ts
  // let sortedRoute: RoutePoint[] = route.sort((a, b) => a.lng - b.lng);

  // const { lat: targetLat, lng: targetLon } = pointCoords;

  // const route: RoutePoint[] = gpxRouteData; //gpxData with 2200 points
  // const route: RoutePoint[] | undefined = await createGPXArray("mapstogpxWHW.gpx");
  const route: RoutePoint[] | undefined = await createGPXArray("WHW.gpx");
  if (!route) throw new Error("WHW.gpx route has not points!");
  const kdTree = buildKDTree(route);
  // console.log("kdTree:", JSON.stringify(kdTree));
  // const kdTree: KDTreeNode = gpxRouteTree;

  const target = pointCoords;
  const nearest = nearestNeighbor(kdTree, target);
  if (nearest) {
    console.log(`Nearest point is: (${nearest.point.lat}, ${nearest.point.lng})`);
    return { lat: nearest.point.lat, lng: nearest.point.lng };
  } else {
    console.log("No nearest neighbor found.");
    throw new Error("no point found");
  }

  // const indices: number[] = binarySearch(sortedRoute, pointCoords);
  // //return sortedRoute[indices[0]];
  // // const [low, high]: number[] = binarySearch(sortedRoute, targetLon);

  // // After binary search, low and high should be the indices of the closest two points by longitude
  // if (!indices) throw new Error("didn't find any route points near the clicked point");

  // const lowerPoint: RoutePoint = sortedRoute[indices[0]];
  // let higherPoint: RoutePoint = sortedRoute[indices[1]]; //high from binarySearch IF it's not edge case

  // if (!indices[1]) higherPoint = lowerPoint; //if edgecase in binarySearch indices[1]=undefined and we have to put 0,0 for the function

  // // find the point the click would be closest to on a line between the two closest points
  // const closestLinePoint: RoutePoint = placeMarkerBetweenPoints(
  //   pointCoords,
  //   lowerPoint,
  //   higherPoint
  // );

  // // Calculate the distances from the target point to the closestLinePoint, lowerPoint, and higherPoint
  // const distanceToLower: number = Math.hypot(
  //   lowerPoint.lat - targetLat,
  //   lowerPoint.lng - targetLon
  // );
  // const distanceToHigher: number = Math.hypot(
  //   higherPoint.lat - targetLat,
  //   higherPoint.lng - targetLon
  // );
  // const distanceToProjection: number = Math.hypot(
  //   closestLinePoint.lat - targetLat,
  //   closestLinePoint.lng - targetLon
  // );

  // // Return the closest point: either the closestLinePoint or one of the two points
  // if (distanceToProjection < Math.min(distanceToLower, distanceToHigher)) {
  //   console.log("closestPoint", closestLinePoint);
  //   console.log("lowerPoint", lowerPoint);
  //   console.log("higherPoint", higherPoint);
  //   return closestLinePoint;
  // } else {
  //   console.log("closestPoint", closestLinePoint);
  //   console.log("lowerPoint", lowerPoint);
  //   console.log("higherPoint", higherPoint);
  //   return distanceToLower < distanceToHigher ? lowerPoint : higherPoint;
  // }
}

export default closestPoints;
