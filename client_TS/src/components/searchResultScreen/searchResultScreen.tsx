import "./searchResultScreen.css";
import APIService from "../../services/googleAPIService";
import { useState, useEffect } from "react";
import DBService from "../../services/DBService";
import { Button } from "@mui/material";
import routeCalculation from "../../helperFunctions/routeCalculation";
import { UserMarker } from "../../types/userMarker";
import { SettingsData } from "../../types/settingsData";

const userID = "66f5228c61b5d88b81ec241c";

interface SearchResultScreenProps {
  marker: UserMarker;
  closeOverlay: () => void;
  markers: UserMarker[];
  setMarkers: (markers: UserMarker[]) => void;
  settingsData: SettingsData;
}

function SearchResultScreen({
  marker,
  closeOverlay,
  markers,
  setMarkers,
  settingsData,
}: SearchResultScreenProps) {
  const [nearAccommodation, setNearAccommodation] = useState<any[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("");

  useEffect(() => {
    if (marker.position) {
      const [lon, lat] = [marker.position.lat, marker.position.lng];
      APIService.extractAccommodations(lon, lat).then((data) => {
        setNearAccommodation(Array.isArray(data) ? data : []);
      });
    }
    if (marker._id) {
      DBService.getAccommodation(userID, marker._id).then((hotel) => {
        if (hotel) {
          setSelectedAccommodation(hotel.hotel);
        } else {
          console.error("Markers data is not in the expected format", hotel);
        }
      });
    }
  }, [marker]);

  function updateAccommodation(accommodation: string) {
    setSelectedAccommodation(accommodation);
    const updatedMarkers = {
      ...markers,
      [marker._id]: { ...marker, hotel: accommodation },
    };
    setMarkers(updatedMarkers);
    DBService.addAccommodation(userID, accommodation, marker._id);
  }

  async function deleteMarker(marker: UserMarker) {
    //TODO check if user_id is not needed?shouldn't be needed
    DBService.removeMarker(userID, marker._id);

    const index = markers.indexOf(marker);
    if (index === -1) {
      throw new Error("Can't find marker to delete in markers array");
    }

    // Remove the element at the found index
    const updatedMarkers = [...markers];
    updatedMarkers.splice(index, 1);

    //nullify indexes of neighouring markers
    const enrichedMarkers = updatedMarkers.map((marker) => ({
      ...marker,
      prevIndex: marker.prevIndex || 0,
      nextIndex: marker.nextIndex || 0,
    }));

    //and then calculate it again
    const calculatedMarkers = await routeCalculation(enrichedMarkers, settingsData);

    setMarkers(calculatedMarkers);

    closeOverlay();
  }

  return (
    <div className="searchResultScreen">
      {marker.position ? (
        <div className="accommodationOptions">
          <ul className="accommodationList">
            {nearAccommodation.length > 0 ? (
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
            ) : (
              <p>No accommodation found.</p>
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
