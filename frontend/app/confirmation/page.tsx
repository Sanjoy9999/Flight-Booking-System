"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ConfirmationPage() {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get booking data from localStorage
  useEffect(() => {
    const bookingData = localStorage.getItem("bookingConfirmation");
    if (bookingData) {
      setBooking(JSON.parse(bookingData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Booking Found</h1>
          <p className="text-gray-600 mb-6">
            Unable to load your booking details.
          </p>
          <Link
            href="/flight"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Search Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 mb-8 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-green-600">
            Your flight booking has been successfully completed.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
            {/* Booking Info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Booking Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Booking ID:</span>{" "}
                  <span className="font-mono font-bold text-blue-600">
                    {booking.bookingId}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Status:</span>{" "}
                  <span className="font-semibold text-green-600">
                    {booking.status}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Date:</span>{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Traveller Info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Traveller Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  {booking.traveller.name}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{" "}
                  {booking.traveller.email}
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span>{" "}
                  {booking.traveller.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-blue-50 rounded p-4">
            <div className="text-sm text-gray-600">Total Price</div>
            <div className="text-3xl font-bold text-blue-600">
              ₹ {booking.lockedPrice}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/flight"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center font-semibold hover:bg-blue-700"
          >
            Search More
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50"
          >
            Print Booking
          </button>
        </div>
      </div>
    </div>
  );
}
