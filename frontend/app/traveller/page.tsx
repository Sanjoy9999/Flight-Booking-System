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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">👤 Traveller Details</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Summary - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded shadow p-4 sticky top-4">
              <h3 className="font-bold mb-4">Selected Flight</h3>
              <div className="space-y-3 text-sm mb-4 pb-4 border-b">
                <p>
                  <strong>Airline:</strong> {flight.airline}
                </p>
                <p>
                  <strong>Price:</strong> ₹{flight.lowestPrice}
                </p>
                <p>
                  <strong>Stops:</strong>{" "}
                  {flight.totalStops === 0
                    ? "Non-stop"
                    : flight.totalStops + " Stop(s)"}
                </p>
              </div>
              <Link
                href="/flight"
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                ← Change Flight
              </Link>
            </div>
          </div>

          {/* Form - Main */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded shadow p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                {/* Passport */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Passport (Optional)
                  </label>
                  <input
                    type="text"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="AB1234567"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {loading ? "Processing..." : "Complete Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
