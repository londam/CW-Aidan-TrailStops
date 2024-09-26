// Function to calculate where the clicked point will land between the closest two points on the route
export default function placeMarkerBetweenPoints(inputPoint, routePoint1, routePoint2) {
  const [inputPointLat, inputPointLon] = inputPoint;
  const [routePoint1Lat, routePoint1Lon] = routePoint1;
  const [routePoint2Lat, routePoint2Lon] = routePoint2;

  const lengthSquared = (routePoint2Lat - routePoint1Lat) ** 2 + (routePoint2Lon - routePoint1Lon) ** 2;

  // calculate how far along the route the input is
  const relativePosition = ((inputPointLat - routePoint1Lat) * (routePoint2Lat - routePoint1Lat) + (inputPointLon - routePoint1Lon) * (routePoint2Lon - routePoint1Lon)) / lengthSquared;

  // Clamp the relative position to the range [0, 1] to make it a percentage along the segment
  const clampedRelativePosition = Math.max(0, Math.min(1, relativePosition));

  // Calculate the closest point for the input between the two points
  const outputPointLat = routePoint1Lat + clampedRelativePosition * (routePoint2Lat - routePoint1Lat);
  const outputPointLon = routePoint1Lon + clampedRelativePosition * (routePoint2Lon - routePoint1Lon);

  return [outputPointLat, outputPointLon];
}