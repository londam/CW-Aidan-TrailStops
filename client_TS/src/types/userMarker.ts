import { RoutePoint } from "./route";

export interface UserMarker {
  position: RoutePoint;
  prevDist: Distance;
  nextDist: Distance;
  _id: string;
  user_id: string;
  hotel: string;
  order: number;
  walkingSpeed: number;
  distanceMeasure: string;
  prevIndex: number;
  nextIndex: number;
}

export interface Distance {
  dist: number;
  time: number;
}
