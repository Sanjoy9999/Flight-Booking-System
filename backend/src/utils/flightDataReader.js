import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read flight data from JSON file
export function getFlightData() {
  const filePath = dirname(__dirname) + "/data/flight.json";
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

// Parse flights from complex JSON structure into simple array
export function parseFlights(flightData) {
  try {
    const { searchId, result } = flightData.data;
    const { journeys, sectors } = result;

    const flights = [];

    // Loop through journeys and get flights from each sector
    for (const journey of Object.values(journeys)) {
      const sectorKey = journey.sector;
      const sectorFlights = sectors[sectorKey];

      if (!sectorFlights) continue;

      // Loop through flights in this sector
      for (const [flightKey, flightInfo] of Object.entries(sectorFlights)) {
        // Calculate total duration
        let totalMinutes = 0;
        for (const segment of flightInfo.flights) {
          totalMinutes += segment.durationInMin || 0;
        }

        // Create flight object
        const flight = {
          flightKey: flightKey,
          flUnqiueId: flightInfo.flUnqiueId,
          airline: flightInfo.otherDetails.airline[0] || "Unknown",
          departureTime: flightInfo.otherDetails.departureTime,
          totalStops: flightInfo.otherDetails.totalStops,
          lowestPrice: flightInfo.otherDetails.lowestPrice,
          flights: flightInfo.flights.map((segment) => ({
            sequence: segment.sequence,
            flightNo: segment.fltNo,
            departureAirport: segment.departureAirport.code,
            arrivalAirport: segment.arrivalAirport.code,
            departureTime: segment.departureAirport.time,
            arrivalTime: segment.arrivalAirport.time,
            duration: segment.durationInMin,
          })),
          totalDuration: totalMinutes,
          fares: flightInfo.fares.map((fare) => ({
            fareId: fare.fareId,
            fareGroup: fare.fareGroup,
            cabinType: fare.fareIdentifiers?.cabinType || "ECONOMY",
            pricePerAdult: fare.price?.pricePerAdult || "0",
            refundable: fare.refundable,
            baggage: fare.baggages,
          })),
          rawData: flightInfo,
        };

        flights.push(flight);
      }
    }

    return {
      searchId: searchId,
      success: true,
      flights: flights,
    };
  } catch (error) {
    console.error("Error parsing flights:", error);
    return {
      success: false,
      error: "Failed to parse flight data",
    };
  }
}
