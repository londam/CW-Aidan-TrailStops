import { RoutePoint } from "../types/route";
import { buildKDTree, nearestNeighbor } from "./kdTree";
import createGPXArray from "./createGPXArray";

// Function to find the two closest points on the route to the clicked point
async function closestPoints(pointCoords: RoutePoint, selectedTrailRouteGPX: string) {
  const route: RoutePoint[] | undefined = await createGPXArray(selectedTrailRouteGPX);
  if (!route) throw new Error(`${selectedTrailRouteGPX} route has not points!`);
  const kdTree = buildKDTree(route);

  const target = pointCoords;
  const nearest = nearestNeighbor(kdTree, target);
  if (nearest) {
    console.log(`Nearest point is: (${nearest.point.lat}, ${nearest.point.lng})`);
    return { lat: nearest.point.lat, lng: nearest.point.lng };
  } else {
    console.log("No nearest neighbor found.");
    throw new Error("no point found");
  }
}

export default closestPoints;
