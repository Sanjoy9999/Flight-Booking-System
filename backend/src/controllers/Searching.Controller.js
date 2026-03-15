import { getFlightData, parseFlights } from "../utils/flightDataReader.js";

// Filter flights based on criteria
function filterFlights(flights, filters) {
  let results = flights;

  // Filter by source airport code
  if (filters.source) {
    results = results.filter((flight) => {
      const source = flight.flights[0]?.departureAirport;
      return source === filters.source.toUpperCase();
    });
  }

  // Filter by destination airport code
  if (filters.destination) {
    results = results.filter((flight) => {
      const lastFlight = flight.flights[flight.flights.length - 1];
      const destination = lastFlight?.arrivalAirport;
      return destination === filters.destination.toUpperCase();
    });
  }

  // Filter by departure date
  if (filters.departureDate) {
    results = results.filter((flight) => {
      // Extract date directly to avoid timezone conversion issues
      const departDate = flight.departureTime.split("T")[0];
      return departDate === filters.departureDate;
    });
  }

  // Filter by maximum price
  if (filters.maxPrice) {
    results = results.filter((flight) => {
      return parseInt(flight.lowestPrice) <= parseInt(filters.maxPrice);
    });
  }

  // Filter by number of stops
  if (filters.stops !== undefined) {
    const selectedStops = parseInt(filters.stops);
    results = results.filter((flight) => {
      if (selectedStops === 0 || selectedStops === 1) {
        return flight.totalStops === selectedStops;
      } else {
        return flight.totalStops >= 2;
      }
    });
  }

  // Filter by departure time range
  if (filters.departureTimeStart) {
    const startHour = parseInt(filters.departureTimeStart);
    results = results.filter((flight) => {
      const departHour = new Date(flight.departureTime).getHours();
      return departHour >= startHour;
    });
  }

  if (filters.departureTimeEnd) {
    const endHour = parseInt(filters.departureTimeEnd);
    results = results.filter((flight) => {
      const departHour = new Date(flight.departureTime).getHours();
      return departHour <= endHour;
    });
  }

  return results;
}

// Search for flights
export const searchFlights = (req, res) => {
  try {
    const filters = req.body;
    console.log(" Search request received with filters:", filters);

    const flightData = getFlightData();
    console.log(" Flight data loaded, searching from file");

    const parsedData = parseFlights(flightData);
    console.log(" Parse result:", {
      success: parsedData.success,
      flights: parsedData.flights?.length || 0,
    });

    if (!parsedData.success) {
      console.error(" Parse failed:", parsedData);
      return res.status(400).json(parsedData);
    }

    console.log(
      " Available flights before filtering:",
      parsedData.flights.length,
    );
    console.log(
      " Sample flight:",
      parsedData.flights[0]
        ? {
            airline: parsedData.flights[0].airline,
            departureTime: parsedData.flights[0].departureTime,
            flights: parsedData.flights[0].flights?.map((f) => ({
              dept: f.departureAirport,
              arr: f.arrivalAirport,
            })),
          }
        : "No flights",
    );

    // Apply all filters
    const filteredFlights = filterFlights(parsedData.flights, filters);
    console.log(" Flights after filtering:", filteredFlights.length);

    // Sort by price (cheapest first)
    filteredFlights.sort(
      (a, b) => parseInt(a.lowestPrice) - parseInt(b.lowestPrice),
    );

    res.json({
      success: true,
      searchId: parsedData.searchId,
      totalResults: filteredFlights.length,
      flights: filteredFlights,
    });
  } catch (error) {
    console.error(" Search error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Error searching flights",
      details: error.message,
    });
  }
};
