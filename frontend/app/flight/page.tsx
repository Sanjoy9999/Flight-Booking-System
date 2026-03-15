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
  //  Valid defaults from flight.json: DEL→SHJ on 2026-03-02
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("SHJ");
  const [departDate, setDepartDate] = useState("02-03-2026");
  const [returnDate, setReturnDate] = useState("05-03-2026");
  const [tripType, setTripType] = useState("one-way");
  const [maxPrice, setMaxPrice] = useState("");
  const [stops, setStops] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [departTimeStart, setDepartTimeStart] = useState("");
  const [departTimeEnd, setDepartTimeEnd] = useState("");

  // Perform search
  async function performSearch(
    fromVal: string,
    toVal: string,
    deptDate: string,
    retDate: string,
    trip: string,
    price: string,
    stopsVal: string,
    pass: string,
    timeStart: string,
    timeEnd: string,
  ) {
    setLoading(true);
    setError("");
    setFlights(null);

    try {
      // Convert DD-MM-YYYY to YYYY-MM-DD format for API
      const convertDate = (dateStr: string) => {
        if (!dateStr) return undefined;
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
      };

      const searchData = {
        source: fromVal,
        destination: toVal,
        departureDate: convertDate(deptDate),
        returnDate: trip === "round-trip" ? convertDate(retDate) : undefined,
        tripType: trip,
        maxPrice: price ? parseInt(price) : undefined,
        stops: stopsVal ? parseInt(stopsVal) : undefined,
        passengers: parseInt(pass),
        departureTimeStart: timeStart ? parseInt(timeStart) : undefined,
        departureTimeEnd: timeEnd ? parseInt(timeEnd) : undefined,
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

  // Handle search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    performSearch(
      from,
      to,
      departDate,
      returnDate,
      tripType,
      maxPrice,
      stops,
      passengers,
      departTimeStart,
      departTimeEnd,
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            ✈️ Flight Search
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 p-6 mb-8 border dark:border-gray-700 transition-all">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            ✈️ Search & Filters
          </h2>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {/* From */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                From City
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                placeholder="DEL"
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                To City
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                placeholder="SHJ"
                maxLength={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            {/* Depart Date */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Depart Date
              </label>
              <input
                type="text"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                placeholder="DD-MM-YYYY"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Trip Type
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              >
                <option value="one-way">One-way</option>
                <option value="round-trip">Round-trip</option>
              </select>
            </div>

            {/* Return Date - only for round-trip */}
            {tripType === "round-trip" && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Return Date
                </label>
                <input
                  type="text"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                />
              </div>
            )}

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Max Price:{" "}
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  ₹{maxPrice || "Any"}
                </span>
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={maxPrice || "50000"}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
              />
            </div>

            {/* Stops */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Stops
              </label>
              <select
                value={stops}
                onChange={(e) => setStops(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              >
                <option value="">All</option>
                <option value="0">Non-stop</option>
                <option value="1">1 Stop</option>
                <option value="2">2+ Stops</option>
              </select>
            </div>

            {/* Departure Time Start */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Departure After (Hour)
              </label>
              <select
                value={departTimeStart}
                onChange={(e) => setDepartTimeStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              >
                <option value="">Anytime</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Time End */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Departure Before (Hour)
              </label>
              <select
                value={departTimeEnd}
                onChange={(e) => setDepartTimeEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              >
                <option value="">Anytime</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                Passengers
              </label>
              <input
                type="number"
                min="1"
                max="9"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            {/* Search Button - Spans all columns */}
            <button
              type="submit"
              disabled={loading}
              className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold py-3 rounded-lg disabled:from-gray-400 disabled:to-gray-500 transition transform hover:scale-105 active:scale-95 shadow-lg dark:shadow-xl cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "🔍 Searching..." : "🔍 Search Flights"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4 text-red-700 dark:text-red-300 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Initial State */}
          {!flights && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 p-8 text-center text-gray-500 dark:text-gray-400 border dark:border-gray-700 transition-all">
              <p className="text-lg">
                ✍️ Enter your search criteria and click Search
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 p-8 text-center border dark:border-gray-700 transition-all">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-3 font-medium">
                🔍 Searching flights...
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && flights && flights.length > 0 && (
            <FlightResults flights={flights} searchId={searchId} />
          )}

          {/* No Results */}
          {!loading && flights && flights.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 p-8 text-center text-gray-500 dark:text-gray-400 border dark:border-gray-700 transition-all">
              <p className="text-lg">No flights found matching your criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
