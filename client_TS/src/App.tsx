import Map from "./components/map/map";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/errorScreen/errorScreen";
import LoginScreen from "./components/loginScreen/loginScreen";
import RegisterScreen from "./components/registerScreen/registerScreen";
import "./App.css";

// main app component, handles routing
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginScreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: <RegisterScreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/map",
      element: <Map />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
