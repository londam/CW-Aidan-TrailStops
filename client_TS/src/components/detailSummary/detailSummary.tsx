import "./detailSummary.css";
import { UserMarker } from "../../types/userMarker";

interface DetailSummaryProps {
  // markers: { [key: string]: UserMarker };
  markers: UserMarker[];
}

function DetailSummary({ markers }: DetailSummaryProps) {
  if (!markers || Object.keys(markers).length === 0) {
    return (
      <div className="detailSummary">
        <div style={{ zIndex: "1000", position: "absolute", top: "1px" }}>No markers placed!</div>
      </div>
    );
  }

  return (
    <div className="detailSummary">
      <img
        className="markerIcon"
        src="marker-icon.png"
        alt="marker icon"
        style={{ marginBottom: "10px" }}
      />
      <p>Start</p>
      <p className="emoji">&#128315;</p>
      {markers[0].prevDist ? (
        <>
          <p style={{ marginBottom: "0px" }}>
            {markers[0].prevDist.dist} kms/
            {markers[0].prevDist.time} hrs{" "}
          </p>
          <p className="emoji">&#128315;</p>
        </>
      ) : (
        "this div"
      )}
      <div className="summary">
        {markers.length > 0 ? (
          markers.map((marker) => (
            <div className="marker" key={marker._id}>
              <img className="markerIcon" src="map-pin.svg" alt="marker icon" />
              <p style={{ marginBottom: "0px" }}>{`Stop ${marker.order}`}</p>
              <div className="markerInfo">
                <p className="emoji">&#128315;</p>
                <p style={{ marginBottom: "0px" }}>
                  {marker.nextDist?.dist} kms/{marker.nextDist?.time} hrs
                </p>
                <p className="emoji">&#128315;</p>
              </div>
            </div>
          ))
        ) : (
          <div>No markers</div>
        )}
        <img className="markerIcon" src="marker-icon.png" alt="marker icon" />
        <p>End</p>
      </div>
    </div>
  );
}

export default DetailSummary;
