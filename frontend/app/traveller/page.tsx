"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBooking } from "@/utils/api";

export default function TravellerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  // Form fields - separate useState for simplicity
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("M");
  const [passport, setPassport] = useState("");

  // Load selected flight from localStorage
  useEffect(() => {
    const flightData = localStorage.getItem("selectedFlight");
    if (!flightData) {
      router.push("/flight");
      return;
    }
    setSelectedFlight(JSON.parse(flightData));
  }, [router]);

  // Check form before submit
  function validateForm(): boolean {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (phone.length < 10) {
      setError("Phone must be 10+ digits");
      return false;
    }
    if (!dob) {
      setError("Date of birth is required");
      return false;
    }
    return true;
  }

  // Submit form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateForm() || !selectedFlight) return;

    setLoading(true);

    try {
      const traveller = { name, email, phone, dob, gender, passport };
      const result = await createBooking(selectedFlight.searchId, traveller);

      // Save booking confirmation
      localStorage.setItem("bookingConfirmation", JSON.stringify(result.data));
      localStorage.removeItem("selectedFlight");

      // Redirect to confirmation
      router.push(`/confirmation?bookingId=${result.data.bookingId}`);
    } catch (err: any) {
      setError(err.message || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  }
  if (!selectedFlight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const flight = selectedFlight.flight;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            👤 Traveller Details
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Summary - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 p-6 sticky top-24 border dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                ✈️ Selected Flight
              </h3>
              <div className="space-y-3 text-sm mb-6 pb-6 border-b dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">
                    Airline:
                  </strong>{" "}
                  {flight.airline}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">
                    Price:
                  </strong>{" "}
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    ₹{flight.lowestPrice}
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">
                    Stops:
                  </strong>{" "}
                  {flight.totalStops === 0
                    ? "Non-stop"
                    : flight.totalStops + " Stop(s)"}
                </p>
              </div>
              <Link
                href="/flight"
                className="inline-block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 cursor-pointer"
              >
                ← Change Flight
              </Link>
            </div>
          </div>

          {/* Form - Main */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 p-8 border dark:border-gray-700 transition-all">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300 font-medium">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    required
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                {/* Passport */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                    Passport (Optional)
                  </label>
                  <input
                    type="text"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="AB1234567"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-bold py-3 rounded-lg disabled:from-gray-400 disabled:to-gray-500 cursor-pointer disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 shadow-lg dark:shadow-xl"
                >
                  {loading ? "⏳ Processing..." : "✓ Complete Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
