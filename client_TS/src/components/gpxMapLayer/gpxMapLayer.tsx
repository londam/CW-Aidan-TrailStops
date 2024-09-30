import { useEffect } from "react";
// import { useEffect } from 'react';
import { useMap } from "react-leaflet";
// import { useMap } from 'react-leaflet';
import L from "leaflet";
// import L from 'leaflet';
import "leaflet-gpx";
// import 'leaflet-gpx';
import "leaflet/dist/leaflet.css";
// import 'leaflet/dist/leaflet.css';
import "./gpxMapLayer.css";
// import './gpxMapLayer.css';
interface GPXLayerProps {
  gpxFile: any;
  // // function to generate the route line on the map
  passRoute: (route: any) => void;
  // const GPXLayer = ({ gpxFile, passRoute }) => {
}
//   const map = useMap();
// function to generate the route line on the map

const GPXLayer: React.FC<GPXLayerProps> = ({ gpxFile, passRoute }) => {
  //   useEffect(() => {
  const map = useMap();
  //     if (!map) return;
  useEffect(() => {
    //     // line settings for rendering
    if (!map) return;
    //     const gpx = new L.GPX(gpxFile, {
    // line settings for rendering
    //       async: true,
    const gpx: any = new L.GPX(gpxFile, {
      //       polyline_options: {
      async: true,
      //         weight: 8,
      polyline_options: {
        //         color: '#c64242',
        weight: 8,
        //       },
        color: "#C64242",
        //     });
      },
    });
    //     gpx.addTo(map);
    gpx.addTo(map);
    //     gpx.on('loaded', () => {
    gpx.on("loaded", () => {
      //       const route = gpx.getLayers();
      const route = gpx.getLayers();
      //       passRoute(route);
      passRoute(route);
      //       map.fitBounds(gpx.getBounds());
      map.fitBounds(gpx.getBounds());
      //     });
    });

    return () => {
      //     return () => {
      map.removeLayer(gpx);
      //       map.removeLayer(gpx);
      map.attributionControl.setPrefix(""); // removes 'leaflet' corner link
      //       map.attributionControl.setPrefix(''); // removes 'leaflet' corner link
    };
    //     };
  }, [map, gpxFile, passRoute]);
  //   }, []);
  return null;
};
//   return null;
export default GPXLayer;
// };

// export default GPXLayer;
