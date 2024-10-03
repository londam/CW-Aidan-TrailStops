import "./map.css";
import { useEffect, useState } from "react";
import { Marker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import * as L from "leaflet";
import GPXLayer from "../gpxMapLayer/gpxMapLayer";
import closestPoints from "../../helperFunctions/closestPoint";
import routeCalculation from "../../helperFunctions/routeCalculation";
import DBService from "../../services/DBService";
import { v4 as uuidv4 } from "uuid";
import "leaflet-gpx";
import "leaflet/dist/leaflet.css";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DetailSummary from "../detailSummary/detailSummary";
import SearchResultScreen from "../searchResultScreen/searchResultScreen";
import Settings from "../settings/settings";
import TripDetailsScreen from "../tripDetailsScreen/tripDetailsScreen";
import { SettingsData } from "../../types/settingsData";
import { UserMarker } from "../../types/userMarker";
import { RoutePoint } from "../../types/route";

const defaultIcon = new L.Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface TrailRoute {
  trail_id: string;
  gpxFile: string;
  name: string;
}

// get user ID from token
const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || null;
  }
  return null;
};

const MapComponent = () => {
  const trailRoutes: TrailRoute[] = [
    {
      trail_id: "WHW_default",
      gpxFile: "/WHW.gpx",
      name: "Aidan's Favourite WHW Route",
    },
    {
      trail_id: "WHW_mapstogpxWHW",
      gpxFile: "/mapstogpxWHW.gpx",
      name: "Better WHW Route :)",
    },
    {
      trail_id: "Full_PCT",
      gpxFile: "/Full_PCT.gpx",
      name: "Dream Route :)",
    },
    {
      trail_id: "CLDT",
      gpxFile: "/CLDT_Croatian_Long_Distance_Trail_2023_v1.gpx",
      name: "Welcome to Croatia",
    },
    {
      trail_id: "SLO_E7",
      gpxFile: "/SLO_european_long_distance_E7.gpx",
      name: "Across Slovenia",
    },
  ];

  const [selectedTrailRoute, setSelectedTrailRoute] = useState<TrailRoute>(trailRoutes[0]);
  const [markers, setMarkers] = useState<UserMarker[]>([]);
  const [gpxRoute, setGpxRoute] = useState<RoutePoint[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<UserMarker | null>(null);
  const [detailsClicked, setDetailsClicked] = useState<Boolean>(false);
  const [settingsClicked, setSettingsClicked] = useState<Boolean>(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    distance: "km",
    speed: 3,
  });

  const userID = getUserIdFromToken();

  const setGpxRouteFunc = (route: RoutePoint[]) => {
    setGpxRoute(route);
  };

  useEffect(() => {
    if (userID) {
      DBService.getMarkers(userID, selectedTrailRoute.trail_id).then(
        (data: UserMarker[] | string | undefined) => {
          if (Array.isArray(data) && data) {
            data.sort((a, b) => a.order - b.order);
            setMarkers(data);
            if (data[0] && data[0].walkingSpeed) {
              setSettingsData((prev) => ({
                ...prev,
                speed: data[0].walkingSpeed,
              }));
            }
          }
        }
      );
    }
  }, [userID, selectedTrailRoute]);

  // handler for marker being added to the map
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (gpxRoute && userID) {
          const closestPoint: RoutePoint = await closestPoints(
            e.latlng,
            selectedTrailRoute.gpxFile
          ); // snap clicked position to route

          // Calculate the distance between the clicked point and the closest point on the route
          const distanceToRoute = e.latlng.distanceTo(L.latLng(closestPoint.lat, closestPoint.lng));

          // Define a threshold for how close the click must be to the route (e.g., 1 kilometer)
          const thresholdDistance = 1000; // Adjust this threshold as needed

          if (distanceToRoute <= thresholdDistance) {
            const newMarker: UserMarker = {
              _id: uuidv4(),
              user_id: userID,
              trail_id: selectedTrailRoute.trail_id,
              position: L.latLng([closestPoint.lat, closestPoint.lng]),
              //  position: { lat: closestPoint.lat, lng: closestPoint.lng }, //TODO Why did I complicate this line above???
              hotel: "",
              prevDist: { dist: 0, time: 0 },
              nextDist: { dist: 0, time: 0 },
              walkingSpeed: settingsData.speed,
              distanceMeasure: settingsData.distance,
            };

            let updatedMarkers: UserMarker[] = [...markers, newMarker];

            const calculatedMarkers: UserMarker[] = await routeCalculation(
              updatedMarkers,
              settingsData,
              selectedTrailRoute.gpxFile
            );
            setMarkers(calculatedMarkers);
            await DBService.addMarker(newMarker, calculatedMarkers);

            setSelectedMarker(
              calculatedMarkers.find((marker) => marker._id === newMarker._id) || null
            );
          }
        }
      },
    });
    return null;
  };

  // handler for placed marker being clicked
  const MarkerClickHandler = (marker: UserMarker) => {
    if (marker) {
      setSelectedMarker(marker);
    } else {
      console.error("Marker not found in state");
    }
  };

  // handler for tripDetails button click
  const TripDetailsClickHandler = () => {
    setDetailsClicked(true);
  };

  const closeSearchOverlay = () => {
    setSelectedMarker(null); // Hide the overlay
  };

  const closeDetailsOverlay = () => {
    setDetailsClicked(false); // Hide the overlay
  };

  const closeSettingsOverlay = () => {
    setSettingsClicked(false); // Hide the overlay
  };

  const onSelectedTrailRouteChange = (trail_id: string) => {
    const selectedTrail = trailRoutes.find((trailRoute) => trailRoute.trail_id === trail_id);
    if (selectedTrail) setSelectedTrailRoute(selectedTrail || null); // Set the full object
  };

  return (
    <>
      <div className="mapContainer">
        <MapContainer
          minZoom={3}
          style={{ height: "100vh", width: "100%" }}
          zoomControl={false}
          scrollWheelZoom={!selectedMarker}
          dragging={!selectedMarker}
          touchZoom={!selectedMarker}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GPXLayer
            gpxFile={selectedTrailRoute.gpxFile}
            passRoute={setGpxRouteFunc}
            passTrail={selectedTrailRoute}
          />
          {Object.values(markers || {}).map((marker) => {
            return (
              <Marker
                key={(marker as UserMarker)._id}
                position={[
                  (marker as UserMarker).position.lat,
                  (marker as UserMarker).position.lng,
                ]}
                icon={defaultIcon}
                eventHandlers={{
                  click: () => MarkerClickHandler(marker as UserMarker),
                }}
              />
            );
          })}
          <MapClickHandler />
        </MapContainer>

        <img
          className="backpackMapImg"
          src="backpack.png"
          alt="brown backpack open at the front showing a wilderness scene inside"
        />

        {!selectedMarker && !detailsClicked && !settingsClicked && (
          <>
            <Button variant="contained" className="tripDetails" onClick={TripDetailsClickHandler}>
              Trip Details
            </Button>
            <Button
              className="settings"
              onClick={() => setSettingsClicked(true)}
              aria-label="Open settings"
              style={{
                backgroundImage: `url(settings.webp)`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: "40px",
                height: "40px",
                border: "none",
                backgroundColor: "transparent",
              }}
            ></Button>
            <DetailSummary markers={markers} />

            <FormControl className="route-selector" style={{ backgroundColor: "white" }}>
              <InputLabel id="route-select-label">Select Route</InputLabel>
              <Select
                labelId="route-select-label"
                value={selectedTrailRoute.trail_id}
                onChange={(e) => onSelectedTrailRouteChange(e.target.value)}
              >
                {trailRoutes.map((trailRoute) => (
                  <MenuItem value={trailRoute.trail_id} key={trailRoute.trail_id}>
                    {trailRoute.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </div>
      {selectedMarker && (
        <div
          className="overlay1"
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <SearchResultScreen
            marker={selectedMarker}
            markers={markers}
            setMarkers={setMarkers}
            closeOverlay={closeSearchOverlay}
            settingsData={settingsData}
            selectedTrailRoute={selectedTrailRoute}
          />
        </div>
      )}
      {detailsClicked && (
        <div
          className="overlay2"
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <TripDetailsScreen
            closeOverlay={closeDetailsOverlay}
            markers={markers}
            setSelectedMarker={setSelectedMarker}
          />
        </div>
      )}
      {settingsClicked && (
        <div
          className="overlay3"
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Settings
            closeOverlay={closeSettingsOverlay}
            settingsData={settingsData}
            setSettingsData={setSettingsData}
            markers={markers}
            setMarkers={setMarkers}
            selectedTrailRoute={selectedTrailRoute}
          />
        </div>
      )}
    </>
  );
};

export default MapComponent;
