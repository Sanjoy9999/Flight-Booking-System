import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read flight data from JSON file
export function getFlightData() {
  const filePath = dirname(dirname(__dirname)) + "/data/flight.json";
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

// Parse flights from complex JSON structure into simple array
export function parseFlights(flightData) {
  try {
    const { searchId, result } = flightData.data;
    const { sectors } = result;

    const flights = [];

    // Loop through sectors and get flights from each sector
    for (const sector of Object.values(sectors)) {
      // Loop through flights in this sector
      for (const [flightKey, flightInfo] of Object.entries(sector)) {
        // Calculate total duration
        let totalMinutes = 0;
        for (const segment of flightInfo.flights) {
          totalMinutes += segment.durationInMin || 0;
        }

        // Keep only one fare per fare bucket (fareGroup + cabinType), choosing the cheapest.
        const fareBuckets = new Map();
        for (const fare of flightInfo.fares || []) {
          const cabinType = fare.fareIdentifiers?.cabinType || "ECONOMY";
          const bucketKey = `${fare.fareGroup}-${cabinType}`;
          const currentPrice = parseInt(fare.price?.pricePerAdult || "0", 10);
          const existingFare = fareBuckets.get(bucketKey);

          if (!existingFare) {
            fareBuckets.set(bucketKey, fare);
            continue;
          }

          const existingPrice = parseInt(
            existingFare.price?.pricePerAdult || "0",
            10,
          );

          if (currentPrice < existingPrice) {
            fareBuckets.set(bucketKey, fare);
          }
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
          fares: Array.from(fareBuckets.values()).map((fare) => ({
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
