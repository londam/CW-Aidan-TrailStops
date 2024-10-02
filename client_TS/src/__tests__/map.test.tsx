import { render, screen, fireEvent, act } from "@testing-library/react";
import MapComponent from "../components/map/map";
import "@testing-library/jest-dom";
import DBService from "../services/DBService";

// Mock DBService and uuid
jest.mock("../services/DBService");
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

describe("MapComponent", () => {
  // Mock default DBService response
  const mockMarkers = [
    {
      _id: "1",
      user_id: "aidan@test.com",
      position: { lat: 45.0, lng: -73.0 },
      hotel: "",
      prevDist: { dist: 0, time: 0 },
      nextDist: { dist: 0, time: 0 },
      walkingSpeed: 3,
      distanceMeasure: "km",
      order: "1",
    },
  ];

  beforeEach(() => {
    (DBService.getMarkers as jest.Mock).mockResolvedValue(mockMarkers);
  });

  it("renders the MapContainer and default elements", async () => {
    render(<MapComponent />);

    // Test if the map container is rendered
    expect(screen.getByRole("img", { name: /brown backpack/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Trip Details/i })).toBeInTheDocument();
    expect(screen.getByAltText(/settings cog icon/i)).toBeInTheDocument();
  });

  it("fetches and displays markers from DBService", async () => {
    render(<MapComponent />);

    // Check if DBService.getMarkers was called
    expect(DBService.getMarkers).toHaveBeenCalledWith("aidan@test.com");

    // Since this involves async data, we can test for markers presence using async utilities
    const marker = await screen.findByText(/Stop 1/i); // This would be rendered by DetailSummary or Markers
    expect(marker).toBeInTheDocument();
  });

  it("opens and closes the trip details overlay", () => {
    render(<MapComponent />);

    // Ensure the trip details button is there
    const tripDetailsButton = screen.getByRole("button", { name: /Trip Details/i });
    fireEvent.click(tripDetailsButton);

    // TripDetailsScreen overlay should now be visible
    expect(screen.getByText(/Trip Details/i)).toBeInTheDocument();
    expect(screen.findByRole("heading", { name: /Trip Details/i }));
    // You can add more tests here for closing and interacting with overlays
  });

  it("opens and closes the settings overlay", () => {
    render(<MapComponent />);

    // Ensure the trip details button is there
    const settingsOverlay = screen.getByRole("button", { name: /Settings/i });
    fireEvent.click(settingsOverlay);

    // Settings overlay should now be visible
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.findByRole("heading", { name: /Settings/i }));
    // You can add more tests here for closing and interacting with overlays
  });
});
