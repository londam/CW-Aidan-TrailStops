import './map.css';
import { useEffect, useState } from 'react';
import { Marker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import GPXLayer from '../gpxMapLayer/gpxMapLayer';
import closestPoints from '../../helperFunctions/closestPoint';
import routeCalculation from '../../helperFunctions/routeCalculation';
import DBService from '../../services/DBService';
import { v4 as uuidv4 } from 'uuid';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import { Button } from '@mui/material';
import DetailSummary from '../detailSummary/detailSummary';
import SearchResultScreen from '../searchResultScreen/searchResultScreen';
import Settings from '../settings/settings';
import TripDetailsScreen from '../tripDetailsScreen/tripDetailsScreen';
import { SettingsData } from '../../types/settingsData';
import { UserMarker } from '../../types/userMarker';
import { RoutePoint } from '../../types/route';

const trailID = 'WHW_default';

const defaultIcon = new L.Icon({
  iconUrl: '/map-pin.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// get user ID from token
const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || null;
  }
  return null;
};

const MapComponent = () => {
  const gpxFile = '/WHW.gpx';
  const [markers, setMarkers] = useState<UserMarker[]>([]);
  const [gpxRoute, setGpxRoute] = useState<RoutePoint[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<UserMarker | null>(null);
  const [detailsClicked, setDetailsClicked] = useState<Boolean>(false);
  const [settingsClicked, setSettingsClicked] = useState<Boolean>(false);
  const [settingsData, setSettingsData] = useState<SettingsData>({
    distance: 'km',
    speed: 3,
  });

  const userID = getUserIdFromToken();

  const setGpxRouteFunc = (route: RoutePoint[]) => {
    setGpxRoute(route);
  };

  useEffect(() => {
    if (userID) {
      DBService.getMarkers(userID, trailID).then(
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
  }, [userID]);

  // handler for marker being added to the map
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (gpxRoute && userID) {
          const closestPoint: RoutePoint = await closestPoints(e.latlng); // snap clicked position to route
          const newMarker: UserMarker = {
            _id: uuidv4(),
            user_id: userID,
            trail_id: trailID,
            position: { lat: closestPoint.lat, lng: closestPoint.lng },
            hotel: '',
            prevDist: { dist: 0, time: 0 },
            nextDist: { dist: 0, time: 0 },
            walkingSpeed: settingsData.speed,
            distanceMeasure: settingsData.distance,
          };

          let updatedMarkers: UserMarker[] = [...markers, newMarker];

          const calculatedMarkers: UserMarker[] = await routeCalculation(
            updatedMarkers,
            settingsData
          );
          setMarkers(calculatedMarkers);
          await DBService.addMarker(newMarker, calculatedMarkers);
          setSelectedMarker(newMarker);
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
      console.error('Marker not found in state');
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

  return (
    <>
      <div className="mapContainer">
        <MapContainer
          minZoom={9}
          style={{ height: '100vh', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={!selectedMarker}
          dragging={!selectedMarker}
          touchZoom={!selectedMarker}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GPXLayer gpxFile={gpxFile} passRoute={setGpxRouteFunc} />
          {markers.map((marker) => (
            <Marker
              key={marker._id}
              position={[marker.position.lat, marker.position.lng]}
              icon={defaultIcon}
              eventHandlers={{
                click: () => MarkerClickHandler(marker),
              }}
            />
          ))}
          <MapClickHandler />
        </MapContainer>
        <img
          className="backpackMapImg"
          src="backpack.png"
          alt="brown backpack open at the front showing a wilderness scene inside"
        />
        {!selectedMarker && !detailsClicked && !settingsClicked && (
          <>
            <Button
              variant="contained"
              className="tripDetails"
              onClick={TripDetailsClickHandler}
            >
              Trip Details
            </Button>
            <Button
              className="settings-button"
              onClick={() => setSettingsClicked(true)}
              aria-label="Open settings"
              style={{
                backgroundImage: `url(settings.webp)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: '40px',
                height: '40px',
                border: 'none',
                backgroundColor: 'transparent',
              }}
            ></Button>

            <img
              className="settings"
              src="settings.webp"
              alt="line render of a settings cog icon"
              onClick={() => setSettingsClicked(true)}
            />
            <DetailSummary markers={markers} />
          </>
        )}
      </div>
      {selectedMarker && (
        <div
          className="overlay1"
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <SearchResultScreen
            marker={selectedMarker}
            markers={markers}
            setMarkers={setMarkers}
            closeOverlay={closeSearchOverlay}
            settingsData={settingsData}
          />
        </div>
      )}
      {detailsClicked && (
        <div
          className="overlay2"
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
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
            position: 'absolute',
            zIndex: 1000,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Settings
            closeOverlay={closeSettingsOverlay}
            settingsData={settingsData}
            setSettingsData={setSettingsData}
            markers={markers}
            setMarkers={setMarkers}
          />
        </div>
      )}
    </>
  );
};

export default MapComponent;
