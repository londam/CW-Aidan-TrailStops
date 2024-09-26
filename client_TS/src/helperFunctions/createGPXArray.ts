// load GPX track as an array of points
export default async function createGPXArray(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`error fetching route status: ${response.status}`);
    }

    const gpxText = await response.text();
    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxText, "application/xml");

    const trackPoints = gpxDoc.getElementsByTagName("trkpt");
    const latLngArray = [];

    for (let i = 0; i < trackPoints.length; i++) {
      const lat = trackPoints[i].getAttribute("lat");
      const lon = trackPoints[i].getAttribute("lon");

      latLngArray.push({ lat: parseFloat(lat), lng: parseFloat(lon) });
    }

    return latLngArray;
  } catch (error) {
    console.error("Error loading GPX:", error);
  }
}
