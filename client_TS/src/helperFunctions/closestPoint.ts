import { RoutePoint } from "../types/route";
import { buildKDTree, KDTreeNode, nearestNeighbor } from "./kdTree";
import { gpxRouteData } from "../data/hikingRoutes/gpxRouteDataLong";
import { gpxRouteTree } from "../data/hikingRoutes/gpxRouteTreeLongGPX";
import createGPXArray from "./createGPXArray";

// Function to find the two closest points on the route to the clicked point
async function closestPoints(pointCoords: RoutePoint) {
  // const route: RoutePoint[] | undefined = await createGPXArray("mapstogpxWHW.gpx");
  const route: RoutePoint[] | undefined = await createGPXArray("WHW.gpx");
  if (!route) throw new Error("WHW.gpx route has not points!");
  const kdTree = buildKDTree(route);

  // this part is for pre-generating the files and then just accessing them
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
}

export default closestPoints;
