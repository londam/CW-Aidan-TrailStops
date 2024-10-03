import "./searchResultScreen.css";
import APIService from "../../services/googleAPIService";
import { useState, useEffect } from "react";
import DBService from "../../services/DBService";
import { Button, Skeleton } from "@mui/material";
import routeCalculation from "../../helperFunctions/routeCalculation";
import { UserMarker } from "../../types/userMarker";
import { SettingsData } from "../../types/settingsData";
import { TrailRoute } from "../map/map";

// Function to get user ID from token
const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || null; // Extract email from token as user ID
  }
  return null;
};

interface SearchResultScreenProps {
  marker: UserMarker;
  closeOverlay: () => void;
  markers: UserMarker[];
  setMarkers: (markers: UserMarker[]) => void;
  settingsData: SettingsData;
  selectedTrailRoute: TrailRoute;
}

function SearchResultScreen({
  marker,
  closeOverlay,
  markers,
  setMarkers,
  settingsData,
  selectedTrailRoute,
}: SearchResultScreenProps) {
  const [nearAccommodation, setNearAccommodation] = useState<any[] | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState("");

  const userID = getUserIdFromToken(); // Extract user ID from the token

  useEffect(() => {
    if (marker.position) {
      const [lon, lat] = [marker.position.lat, marker.position.lng];
      APIService.extractAccommodations(lon, lat).then((data) => {
        setNearAccommodation(Array.isArray(data) ? data : []);
      });
    }
    if (marker._id && userID) {
      DBService.getAccommodation(userID, marker._id).then((hotel) => {
        if (hotel) {
          setSelectedAccommodation(hotel.hotel);
        } else {
          console.error("Markers data is not in the expected format", hotel);
        }
      });
    }
  }, [marker, userID]);

  function updateAccommodation(accommodation: string) {
    setSelectedAccommodation(accommodation);
    const updatedMarkers = markers.map((m) =>
      m._id === marker._id ? { ...m, hotel: accommodation } : m
    );
    setMarkers(updatedMarkers);
    if (userID) {
      DBService.addAccommodation(userID, accommodation, marker._id); // Use authenticated userID
    }
  }

  async function deleteMarker(marker: UserMarker) {
    if (userID) {
      DBService.removeMarker(userID, marker._id); // Use authenticated userID
    }

    const index = markers.indexOf(marker);
    if (index === -1) {
      throw new Error("Can't find marker to delete in markers array");
    }

    // Remove the element at the found index
    const updatedMarkers = [...markers];
    updatedMarkers.splice(index, 1);

    // Nullify indexes of neighboring markers
    const enrichedMarkers = updatedMarkers.map((m) => ({
      ...m,
      prevIndex: m.prevIndex || 0,
      nextIndex: m.nextIndex || 0,
    }));

    //and then calculate it again
    const calculatedMarkers = await routeCalculation(
      enrichedMarkers,
      settingsData,
      selectedTrailRoute.gpxFile
    );

    setMarkers(calculatedMarkers);

    closeOverlay();
  }

  return (
    <div className="searchResultScreen">
      {marker.position ? (
        <div className="accommodationOptions">
          <ul className="accommodationList">
            {nearAccommodation === null ? (
              // Loading skeleton from MUI
              <Skeleton variant="rectangular" width={400} height={400} />
            ) : nearAccommodation.length === 0 ? (
              // No accommodations found
              <p>No accommodation found.</p>
            ) : (
              // Show list of accommodations
              nearAccommodation.map((accommodation, index) => (
                <div key={index}>
                  <li key={index}>
                    {accommodation.name}
                    <br />
                    {accommodation.vicinity}
                  </li>
                  <img
                    className="accommodationImage"
                    src={accommodation.url.data}
                    alt={accommodation.name}
                  />
                  <Button
                    variant="contained"
                    onClick={() =>
                      updateAccommodation(accommodation.name + " - " + accommodation.vicinity)
                    }
                  >
                    Select
                  </Button>
                </div>
              ))
            )}
          </ul>
          <p className="wildOption">Wild Camping</p>
          <Button variant="contained" onClick={() => updateAccommodation("Wild Camping")}>
            Select
          </Button>
        </div>
      ) : (
        <p>No closest point data available.</p>
      )}
      <div>
        <h1>Stop {marker.order}</h1>
        <h2>Previous Stop: {marker.prevDist?.dist ? `${marker.prevDist.dist} km` : "N/A"}</h2>
        <h3>
          Time from previous stop: {marker.prevDist?.time ? `${marker.prevDist.time} hours` : "N/A"}
        </h3>
        <h2>Next Stop: {marker.nextDist?.dist ? `${marker.nextDist.dist} km` : "N/A"}</h2>
        <h3>
          Time to next stop: {marker.nextDist?.time ? `${marker.nextDist.time} hours` : "N/A"}
        </h3>
        <p>
          Selected accommodation:{" "}
          {selectedAccommodation === "" ? " no accommodation selected" : selectedAccommodation}
        </p>
        <Button variant="contained" style={{ marginRight: "10px" }} onClick={() => closeOverlay()}>
          Back
        </Button>
        <Button variant="contained" onClick={() => deleteMarker(marker)}>
          Delete Marker
        </Button>
      </div>
    </div>
  );
}

export default SearchResultScreen;
