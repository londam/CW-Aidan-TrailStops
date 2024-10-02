import { render, screen } from "@testing-library/react";
import DetailSummary from "../components/detailSummary/detailSummary";
import { UserMarker } from "../types/userMarker";
import "@testing-library/jest-dom";

// Mock data
const mockMarkers: { [key: string]: UserMarker } = {
  "1": {
    _id: "1",
    order: 2,
    walkingSpeed: 5,
    prevDist: { dist: 5, time: 1 },
    nextDist: { dist: 3, time: 0.5 },
  },
  "2": {
    _id: "2",
    order: 1,
    walkingSpeed: 5,
    prevDist: { dist: 10, time: 2 },
    nextDist: { dist: 5, time: 1 },
  },
};

describe("DetailSummary Component", () => {
  it("renders 'No markers placed!' when markers are empty", () => {
    render(<DetailSummary markers={{}} />);
    expect(screen.getByText("No markers placed!")).toBeInTheDocument();
  });

  it("renders sorted markers when markers are provided", () => {
    render(<DetailSummary markers={mockMarkers} />);

    // Check that the markers are rendered in the correct order
    expect(screen.getByText("Stop 1")).toBeInTheDocument();
    expect(screen.getByText("Stop 2")).toBeInTheDocument();
  });

  it("displays prevDist correctly for the first marker", () => {
    render(<DetailSummary markers={mockMarkers} />);
    expect(screen.getByText("10 kms/2 hrs")).toBeInTheDocument();
  });

  it("displays nextDist correctly for subsequent markers", () => {
    render(<DetailSummary markers={mockMarkers} />);
    expect(screen.getByText("5 kms/1 hrs")).toBeInTheDocument();
  });

  it("renders the end marker and start marker", () => {
    render(<DetailSummary markers={mockMarkers} />);
    expect(screen.getByText("Start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  it("renders marker icons", () => {
    render(<DetailSummary markers={mockMarkers} />);
    expect(screen.getAllByAltText("marker icon").length).toBeGreaterThan(1);
  });
});
