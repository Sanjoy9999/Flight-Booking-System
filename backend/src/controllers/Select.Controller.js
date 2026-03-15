import selectModel from "../models/selectModel.js";
import { getFlightData } from "../utils/flightDataReader.js";

// Find flight in sectors
function findFlight(flightKey) {
  const flightData = getFlightData();
  const sectors = flightData.data.result.sectors;

  for (const [sector, flights] of Object.entries(sectors)) {
    if (flights[flightKey]) {
      return flights[flightKey];
    }
  }

  return null;
}

// Select a flight
export const selectFlight = async (req, res) => {
  try {
    const { searchId, flightKey, fareId } = req.body;

    // Validate inputs
    if (!searchId || !flightKey || !fareId) {
      return res.status(400).json({
        success: false,
        error: "Missing: searchId, flightKey, fareId",
      });
    }

    // Find the flight
    const flightOption = findFlight(flightKey);
    if (!flightOption) {
      return res.status(404).json({
        success: false,
        error: "Flight not found",
      });
    }

    // Find the fare
    const selectedFare = flightOption.fares.find(
      (fare) => fare.fareId === fareId,
    );
    if (!selectedFare) {
      return res.status(404).json({
        success: false,
        error: "Fare not found",
      });
    }

    // Save to database
    const selectedFlight = new selectModel({
      searchId: searchId,
      flightKey: flightKey,
      fareId: fareId,
      flightData: flightOption,
      selectedFare: selectedFare,
      lockedPrice: selectedFare.price?.pricePerAdult || "0",
    });

    await selectedFlight.save();

    res.json({
      success: true,
      message: "Flight selected successfully",
      data: {
        _id: selectedFlight._id,
        searchId: selectedFlight.searchId,
        flightKey: selectedFlight.flightKey,
        fareId: selectedFlight.fareId,
        lockedPrice: selectedFlight.lockedPrice,
      },
    });
  } catch (error) {
    console.error("Select flight error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get selected flight by search ID
export const getSelectedFlight = async (req, res) => {
  try {
    const { searchId } = req.params;

    const selectedFlight = await selectModel.findOne({ searchId });
    if (!selectedFlight) {
      return res.status(404).json({
        success: false,
        error: "No selected flight found",
      });
    }

    res.json({
      success: true,
      data: selectedFlight,
    });
  } catch (error) {
    console.error("Get selected flight error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
