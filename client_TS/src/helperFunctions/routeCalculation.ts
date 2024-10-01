import createGPXArray from "./createGPXArray";
import haversineDistanceCalc from "./haversineDistanceCalc";
import isMarkerBetweenRoutePoints from "./checkMarkerPosition";
import { RoutePoint } from "../types/route";
import { UserMarker } from "../types/userMarker";
import { SettingsData } from "../types/settingsData";
import { gpxRouteData } from "../data/hikingRoutes/gpxRouteDataLong";

// loop through all points in route from index1 to index2 to calculate an accurate distance.
function fullDistanceCalc(
  markerDist: number, //distance to previous or next point
  routeArr: RoutePoint[], //array of all the points
  routeIndex1: number, //starting point of this route segment (either first point in Route, or next point from previous marker)
  routeIndex2: number, //ending point of this route segment
  distanceMeasureUnit: string //distance unit
) {
  for (let i = routeIndex1; i < routeIndex2; i++) {
    markerDist += haversineDistanceCalc(routeArr[i], routeArr[i + 1], distanceMeasureUnit);
  }
  // return Math.round(markerDist);
  return markerDist;
}

function walkingTimeCalc(markerDist: number, speed: number) {
  return Math.round(markerDist / speed);
}

async function routeCalculation(markerArr: UserMarker[], calculationSettings: SettingsData) {
  const routeArr: RoutePoint[] | undefined = await createGPXArray("WHW.gpx");
  // const routeArr: RoutePoint[] | undefined = await createGPXArray("mapstogpxWHW.gpx"); fetched from Google via https://mapstogpx.com/
  if (!routeArr) throw new Error("WHW.gpx route has not points!");
  // const routeArr: RoutePoint[] = gpxRouteData;
  console.log("marker", markerArr[0]);

  let markerArrCopy = JSON.parse(JSON.stringify(markerArr));
  // find where the markers fall between in the route
  for (let i = 0; i < markerArrCopy.length; i++) {
    // loop through markerArr
    for (let j = 0; j < routeArr.length - 1; j++) {
      // loop through routeArr
      if (
        markerArrCopy[i].position.lat === routeArr[j].lat &&
        markerArrCopy[i].position.lng === routeArr[j].lng
      ) {
        markerArrCopy[i].prevIndex = j;
        markerArrCopy[i].nextIndex = j + 1;
        break;
      }
      // if (isMarkerBetweenRoutePoints(markerArrCopy[i], routeArr[j], routeArr[j + 1])) {
      //   markerArrCopy[i].prevIndex = j;
      //   markerArrCopy[i].nextIndex = j + 1;
      //   break;
      // }
    }
  }
  // TODO implement both ways search

  // sort markerArrCopy to to be in order of prevIndex
  markerArrCopy.sort((a: UserMarker, b: UserMarker) => a.prevIndex - b.prevIndex);

  // calculate prev and next distance for each marker to their prev and next route point
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].prevDist.dist = haversineDistanceCalc(
      routeArr[markerArrCopy[i].prevIndex],
      markerArrCopy[i].position,
      calculationSettings.distance
    );
    markerArrCopy[i].nextDist.dist = haversineDistanceCalc(
      routeArr[markerArrCopy[i].nextIndex],
      markerArrCopy[i].position,
      calculationSettings.distance
    );
  }

  // calculate full distances between markers
  for (let i = 0; i < markerArrCopy.length; i++) {
    if (markerArrCopy.length === 1) {
      //if only 1 marker
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(
        markerArrCopy[i].prevDist.dist,
        routeArr,
        0,
        markerArrCopy[i].prevIndex,
        calculationSettings.distance
      );
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(
        markerArrCopy[i].nextDist.dist,
        routeArr,
        markerArrCopy[i].nextIndex,
        routeArr.length - 1,
        calculationSettings.distance
      );
    } else if (i === 0) {
      //if more markers and this is the first one
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(
        markerArrCopy[i].prevDist.dist,
        routeArr,
        0,
        markerArrCopy[i].prevIndex,
        calculationSettings.distance
      );
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(
        markerArrCopy[i].nextDist.dist,
        routeArr,
        markerArrCopy[i].nextIndex,
        markerArrCopy[i + 1].prevIndex,
        calculationSettings.distance
      );
    } else if (i === markerArrCopy.length - 1) {
      // if more markers and this is the last one
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(
        markerArrCopy[i].prevDist.dist,
        routeArr,
        markerArrCopy[i - 1].nextIndex,
        markerArrCopy[i].prevIndex,
        calculationSettings.distance
      );
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(
        markerArrCopy[i].nextDist.dist,
        routeArr,
        markerArrCopy[i].nextIndex,
        routeArr.length - 1,
        calculationSettings.distance
      );
    } else {
      // if more markers and this is nor first nor last
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(
        markerArrCopy[i].prevDist.dist,
        routeArr,
        markerArrCopy[i - 1].nextIndex,
        markerArrCopy[i].prevIndex,
        calculationSettings.distance
      );
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(
        markerArrCopy[i].nextDist.dist,
        routeArr,
        markerArrCopy[i].nextIndex,
        markerArrCopy[i + 1].prevIndex,
        calculationSettings.distance
      );
    }
  }

  // delete prevIndex and nextIndex as no longer needed
  for (let i = 0; i < markerArrCopy.length; i++) {
    delete markerArrCopy[i].prevIndex;
    delete markerArrCopy[i].nextIndex;
  }

  //calculate previous and next walking time
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].prevDist.time = walkingTimeCalc(
      markerArrCopy[i].prevDist.dist,
      calculationSettings.speed
    );
    markerArrCopy[i].nextDist.time = walkingTimeCalc(
      markerArrCopy[i].nextDist.dist,
      calculationSettings.speed
    );
  }

  //save marker route order in marker
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].order = i + 1;
  }

  // change markers back to object
  const output: { [key: string]: UserMarker } = markerArrCopy.reduce((acc, curr) => {
    acc[curr._id] = curr;
    return acc;
  }, {});
  console.log("output", output);

  return output;
}

export default routeCalculation;
