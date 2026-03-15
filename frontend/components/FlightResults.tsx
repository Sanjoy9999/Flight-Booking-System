"use client";

import { useState } from "react";
import FlightCard from "@/components/FlightCard";

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
  flights: Flight[];
  searchId: string;
}

export default function FlightResults({ flights, searchId }: Props) {
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [selectedFares, setSelectedFares] = useState<{ [key: string]: string }>(
    {},
  );

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 p-4 border dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          Found{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
            {flights.length}
          </span>{" "}
          {flights.length === 1 ? "flight" : "flights"} 🛫
        </p>
      </div>

      {/* Flight List */}
      {flights.map((flight) => (
        <FlightCard
          key={flight.flightKey}
          flight={flight}
          searchId={searchId}
          isSelected={selectedFlight === flight.flightKey}
          onSelect={setSelectedFlight}
          selectedFareId={
            selectedFares[flight.flightKey] || flight.fares[0]?.fareId
          }
          onFareSelect={(fareId: string) => {
            setSelectedFares((prev) => ({
              ...prev,
              [flight.flightKey]: fareId,
            }));
          }}
        />
      ))}
    </div>
  );
}
