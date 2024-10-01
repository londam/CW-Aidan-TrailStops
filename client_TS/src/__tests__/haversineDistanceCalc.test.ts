import { RoutePoint } from "../types/route";

import haversineDistance from "../helperFunctions/haversineDistanceCalc";

// Mock data for RoutePoint coordinates
const coord1: RoutePoint = { lat: 40.748817, lng: -73.985428 }; // New York, USA
const coord2: RoutePoint = { lat: 48.858844, lng: 2.294351 }; // Paris, France

describe.only("haversineDistance", () => {
  it("should calculate distance between two points in kilometers", () => {
    const result = haversineDistance(coord1, coord2, "km");
    console.log("Distance (km):", result);
    expect(result).toBeCloseTo(5829.5, 1); // Rough distance between New York and Paris in km
  });

  it("should calculate distance between two points in miles", () => {
    const result = haversineDistance(coord1, coord2, "m");
    expect(result).toBeCloseTo(3622.26, 1); // Rough distance between New York and Paris in miles
  });

  it("should throw an error when an invalid distance unit is provided", () => {
    expect(() => haversineDistance(coord1, coord2, "invalidUnit")).toThrowError(
      "Distance Measure Unit not 'km' or 'm'"
    );
  });
});
