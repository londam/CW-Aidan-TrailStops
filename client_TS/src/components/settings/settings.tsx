import "./settings.css";
import { Select, FormControl, Button, MenuItem, SelectChangeEvent } from "@mui/material";
import DBService from "../../services/DBService";
import routeCalculation from "../../helperFunctions/routeCalculation";
import { useEffect } from "react";
import { SettingsData } from "../../types/settingsData";
import { UserMarker } from "../../types/userMarker";
import { TrailRoute } from "../map/map";

interface SettingsProps {
  closeOverlay: () => void;
  settingsData: SettingsData;
  setSettingsData: (data: SettingsData) => void;
  markers: UserMarker[];
  setMarkers: (markers: UserMarker[]) => void;
  selectedTrailRoute: TrailRoute;
}

function Settings({
  closeOverlay,
  settingsData,
  setSettingsData,
  markers,
  setMarkers,
  selectedTrailRoute,
}: SettingsProps) {
  // Effect to handle updates based on settingsData changes
  useEffect(() => {
    const updateMarkers = async () => {
      if (settingsData.speed !== undefined) {
        const updatedMarkers = await routeCalculation(
          Object.values(markers),
          settingsData,
          selectedTrailRoute.gpxFile
        );
        DBService.updateAllMarkers(updatedMarkers);
        setMarkers(updatedMarkers);
      }
    };
    updateMarkers();
    // }, [settingsData, markers, setMarkers]); // Trigger on settingsData change
  }, []); // Trigger on settingsData change

  const changeSpeedSetting = (event: SelectChangeEvent<number>) => {
    setSettingsData({ ...settingsData, speed: Number(event.target.value) });
  };

  // commented for now

  const changeDistanceSetting = async (event: React.ChangeEvent<{ value: unknown }>) => {
    setSettingsData({ ...settingsData, distance: String(event.target.value) });
    const updatedMarkers = await routeCalculation(Object.values(markers), {
      ...settingsData,
      distance: String(event.target.value),
    });
    DBService.updateAllMarkers(updatedMarkers);
    setMarkers(updatedMarkers);
  };

  return (
    <div style={{ marginBottom: "10px" }} className="settingsScreen">
      <h1>Settings</h1>
      <form style={{ marginBottom: "10px" }}>
        <FormControl>
          <Select value={settingsData.speed} onChange={changeSpeedSetting}>
            <MenuItem value={2}>2Kmph - Slow</MenuItem>
            <MenuItem value={3}>3Kmph - Regular</MenuItem>
            <MenuItem value={4}>4Kmph - Fast</MenuItem>
            <MenuItem value={5}>5Kmph - Lightning</MenuItem>
          </Select>
        </FormControl>
        {/* <FormControl>
          <Select
            value={settingsData.distance}
            onChange={changeDistanceSetting}
          >
            <MenuItem value="km">Kilometers</MenuItem>
            <MenuItem value="m">Miles</MenuItem>
          </Select>
        </FormControl> */}
      </form>
      <Button variant="contained" className="backButton" onClick={closeOverlay}>
        Back
      </Button>
    </div>
  );
}

export default Settings;
