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
        }),
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
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 overflow-hidden transition border-2 ${
        isSelected
          ? "border-blue-500 dark:border-blue-400"
          : "border-transparent dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/20"
      } transform hover:-translate-y-1 transition-transform`}
    >
      <div className="p-6">
        {/* Flight Header - Main Info */}
        <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b dark:border-gray-700">
          {/* Airline */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Airline
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-lg">
              ✈️ {flight.airline}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              #{flight.flights[0]?.flightNo}
            </div>
          </div>

          {/* Departure */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Departure
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {departTime}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Duration: {duration}
            </div>
          </div>

          {/* Arrival */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Arrival
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {arriveTime}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {stopsText}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Price
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ₹{flight.lowestPrice}
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4 mb-6 border border-blue-100 dark:border-gray-600">
          <div className="text-xs font-bold mb-3 text-gray-700 dark:text-gray-200">
            📍 Route:
          </div>
          <div className="flex items-center justify-between text-sm">
            {flight.flights.map((seg, idx, arr) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="text-center">
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    {seg.departureAirport}
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="flex-1 mx-2 border-t-2 border-blue-300 dark:border-gray-500"></div>
                )}
              </div>
            ))}
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white text-lg">
                {lastSegment.arrivalAirport}
              </div>
            </div>
          </div>
        </div>

        {/* Fare Selection */}
        {flight.fares.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-bold mb-3 text-gray-900 dark:text-white">
              💳 Select Fare:
            </div>
            <div className="flex gap-2 flex-wrap">
              {flight.fares.map((fare) => (
                <button
                  key={fare.fareId}
                  onClick={() => {
                    onSelect(flight.flightKey);
                    onFareSelect(fare.fareId);
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition transform hover:scale-105 cursor-pointer ${
                    selectedFareId === fare.fareId
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white border-blue-600 dark:border-blue-400 shadow-lg"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md"
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
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-4 text-sm text-red-700 dark:text-red-300 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Select Button */}
        <button
          onClick={handleSelectFlight}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-bold py-3 rounded-lg disabled:from-gray-400 disabled:to-gray-500 cursor-pointer disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 shadow-lg dark:shadow-xl"
        >
          {loading ? "⏳ Processing..." : "✓ Continue"}
        </button>
      </div>
    </div>
  );
}
