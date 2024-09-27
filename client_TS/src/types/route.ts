export interface RouteData {
  type: string;
  coordinates: RoutePoint[];
}

export interface RoutePoint {
  lat: number;
  lng: number;
}
