// check that the current marker falls between its surrounding route points

import { RoutePoint } from "../types/route";
import { UserMarker } from "../types/userMarker";

// lats & lngs either in a positive or negative direction
export default function isMarkerBetweenRoutePoints(
  marker: UserMarker,
  routePoint1: RoutePoint,
  routePoint2: RoutePoint
) {
  return (
    ((marker.position.lng >= routePoint1.lng && marker.position.lng <= routePoint2.lng) ||
      (marker.position.lng <= routePoint1.lng && marker.position.lng >= routePoint2.lng)) &&
    ((marker.position.lat >= routePoint1.lat && marker.position.lat <= routePoint2.lat) ||
      (marker.position.lat <= routePoint1.lat && marker.position.lat >= routePoint2.lat))
  );
}
