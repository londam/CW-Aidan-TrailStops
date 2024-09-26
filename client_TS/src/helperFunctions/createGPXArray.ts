import { RoutePoint } from "../types/route";

// load GPX track as an array of points
export default async function createGPXArray(url: string) {
  try {
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(`error fetching route status: ${response.status}`);
    }

    const gpxText: string = await response.text();
    const parser: DOMParser = new DOMParser();
    const gpxDoc: Document = parser.parseFromString(gpxText, "application/xml");

    const trackPoints = gpxDoc.getElementsByTagName("trkpt");
    const RoutePointsArray: RoutePoint[] = [];

    for (let i = 0; i < trackPoints.length; i++) {
      const lat: string | null = trackPoints[i].getAttribute("lat");
      const lon: string | null = trackPoints[i].getAttribute("lon");

      if (lat && lon) RoutePointsArray.push({ lat: parseFloat(lat), lng: parseFloat(lon) });
    }

    return RoutePointsArray;
  } catch (error) {
    console.error("Error loading GPX:", error);
  }
}
