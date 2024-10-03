import { RoutePoint } from "../types/route";
import { buildKDTree, nearestNeighbor } from "./kdTree";
import createGPXArray from "./createGPXArray";
import { kdTreeCached } from "../data/hikingRoutes/CLDT";

// Function to find the two closest points on the route to the clicked point
async function closestPoints(pointCoords: RoutePoint, selectedTrailRouteGPX: string) {
  const route: RoutePoint[] | undefined = await createGPXArray(selectedTrailRouteGPX);
  if (!route) throw new Error(`${selectedTrailRouteGPX} route has not points!`);

  const kdTree =
    selectedTrailRouteGPX === "/CLDT_Croatian_Long_Distance_Trail_2023_v1.gpx"
      ? kdTreeCached //example of precalculated KDTree to safe time
      : buildKDTree(route);

  const target = pointCoords;
  const nearest = nearestNeighbor(kdTree, target);
  if (nearest) {
    return { lat: nearest.point.lat, lng: nearest.point.lng };
  } else {
    console.log("No nearest neighbor found.");
    throw new Error("no point found");
  }
}

export default closestPoints;
