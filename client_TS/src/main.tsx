import App from "./App.tsx";
//import "./index.css";

import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";

// strict mode turned off to prevent double renders
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);
