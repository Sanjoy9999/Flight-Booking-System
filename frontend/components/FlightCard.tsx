"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { selectFlight } from "@/utils/api";
import { formatTime, calculateDuration, getStopsText } from "@/utils/helpers";

interface Flight {
  flightKey: string;
  airline: string;
  departureTime: string;
  totalStops: number;
  lowestPrice: string;
  flights: any[];
  totalDuration: number;
  fares: any[];
}

interface Props {
  flight: Flight;
  searchId: string;
  isSelected: boolean;
  onSelect: (flightKey: string) => void;
  selectedFareId: string;
  onFareSelect: (fareId: string) => void;
}

export default function FlightCard({
  flight,
  searchId,
  isSelected,
  onSelect,
  selectedFareId,
  onFareSelect,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get last flight segment for arrival time
  const lastSegment = flight.flights[flight.flights.length - 1];
  const departTime = formatTime(flight.departureTime);
  const arriveTime = formatTime(lastSegment.arrivalTime);
  const duration = calculateDuration(flight.totalDuration);
  const stopsText = getStopsText(flight.totalStops);

  // Handle flight selection
  async function handleSelectFlight() {
    if (!selectedFareId) {
      setError("Please select a fare");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await selectFlight(searchId, flight.flightKey, selectedFareId);

      // Save to localStorage for traveller page
      localStorage.setItem(
        "selectedFlight",
        JSON.stringify({
          searchId,
          flightKey: flight.flightKey,
          fareId: selectedFareId,
          flight,
        })
      );

      // Go to traveller page
      router.push("/traveller");
    } catch (err: any) {
      setError(err.message || "Failed to select flight");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`bg-white rounded shadow overflow-hidden transition border-2 ${
        isSelected ? "border-blue-500" : "border-transparent hover:shadow-lg"
      }`}
    >
      <div className="p-4">
        {/* Flight Header - Main Info */}
        <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b">
          {/* Airline */}
          <div>
            <div className="text-xs text-gray-500">Airline</div>
            <div className="font-semibold">✈️ {flight.airline}</div>
            <div className="text-xs text-gray-600">#{flight.flights[0]?.flightNo}</div>
          </div>

          {/* Departure */}
          <div>
            <div className="text-xs text-gray-500">Departure</div>
            <div className="text-2xl font-bold">{departTime}</div>
            <div className="text-xs text-gray-600">Duration: {duration}</div>
          </div>

          {/* Arrival */}
          <div>
            <div className="text-xs text-gray-500">Arrival</div>
            <div className="text-2xl font-bold">{arriveTime}</div>
            <div className="text-xs text-gray-600">{stopsText}</div>
          </div>

          {/* Price */}
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-3xl font-bold text-green-600">₹{flight.lowestPrice}</div>
          </div>
        </div>

        {/* Route */}
        <div className="bg-gray-50 rounded p-3 mb-4">
          <div className="text-xs font-semibold mb-2">Route:</div>
          <div className="flex items-center justify-between text-sm">
            {flight.flights.map((seg, idx, arr) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="text-center">
                  <div className="font-bold">{seg.departureAirport}</div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex-1 mx-2 border-t-2 border-gray-300"></div>
                )}
              </div>
            ))}
            <div className="text-center">
              <div className="font-bold">{lastSegment.arrivalAirport}</div>
            </div>
          </div>
        </div>

        {/* Fare Selection */}
        {flight.fares.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Select Fare:</div>
            <div className="flex gap-2 flex-wrap">
              {flight.fares.map((fare) => (
                <button
                  key={fare.fareId}
                  onClick={() => {
                    onSelect(flight.flightKey);
                    onFareSelect(fare.fareId);
                  }}
                  className={`px-3 py-2 rounded border text-sm font-medium transition ${
                    selectedFareId === fare.fareId
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {fare.fareGroup} - {fare.cabinType}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Select Button */}
        <button
          onClick={handleSelectFlight}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
