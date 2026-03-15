"use client";

import { useState } from "react";
import FlightResults from "@/components/FlightResults";
import { searchFlights } from "@/utils/api";

export default function FlightsPage() {
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any>(null);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");

  // Filter state - using individual useState for clarity
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BLR");
  const [departDate, setDepartDate] = useState("31-01-2026");
  const [returnDate, setReturnDate] = useState("03-02-2026");
  const [tripType, setTripType] = useState("round-trip");
  const [maxPrice, setMaxPrice] = useState("");
  const [stops, setStops] = useState("");
  const [passengers, setPassengers] = useState("1");

  // Handle search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlights(null);

    try {
      const searchData = {
        source: from,
        destination: to,
        departureDate: departDate,
        returnDate: tripType === "round-trip" ? returnDate : undefined,
        tripType: tripType,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        stops: stops ? parseInt(stops) : undefined,
        passengers: parseInt(passengers),
      };

      const result = await searchFlights(searchData);
      setFlights(result.flights || []);
      setSearchId(result.searchId);
    } catch (err: any) {
      setError(err.message || "Failed to search flights");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">✈️ Flight Search</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Search Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Filters</h2>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* From */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    From City
                  </label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value.toUpperCase())}
                    placeholder="DEL"
                    maxLength={3}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    To City
                  </label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value.toUpperCase())}
                    placeholder="BLR"
                    maxLength={3}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>

                {/* Depart Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Depart Date
                  </label>
                  <input
                    type="text"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    placeholder="DD-MM-YYYY"
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>

                {/* Trip Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trip Type
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    <option value="one-way">One-way</option>
                    <option value="round-trip">Round-trip</option>
                  </select>
                </div>

                {/* Return Date - only for round-trip */}
                {tripType === "round-trip" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Return Date
                    </label>
                    <input
                      type="text"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      placeholder="DD-MM-YYYY"
                      className="w-full px-3 py-2 border rounded text-sm"
                    />
                  </div>
                )}

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Max Price: ₹{maxPrice || "Any"}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={maxPrice || "50000"}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Stops */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Stops
                  </label>
                  <select
                    value={stops}
                    onChange={(e) => setStops(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  >
                    <option value="">All</option>
                    <option value="0">Non-stop</option>
                    <option value="1">1 Stop</option>
                    <option value="2">2+ Stops</option>
                  </select>
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Passengers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="lg:col-span-3">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">
                {error}
              </div>
            )}

            {/* Initial State */}
            {!flights && !loading && (
              <div className="bg-white rounded shadow p-8 text-center text-gray-500">
                Enter your search criteria and click Search
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded shadow p-8 text-center">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                <p className="text-gray-600 mt-2">Searching flights...</p>
              </div>
            )}

            {/* Results */}
            {!loading && flights && flights.length > 0 && (
              <FlightResults flights={flights} searchId={searchId} />
            )}

            {/* No Results */}
            {!loading && flights && flights.length === 0 && (
              <div className="bg-white rounded shadow p-8 text-center text-gray-500">
                No flights found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
