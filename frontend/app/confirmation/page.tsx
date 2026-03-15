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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            No Booking Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            Unable to load your booking details.
          </p>
          <Link
            href="/flight"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition"
          >
            Search Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700/50 rounded-xl p-8 mb-8 text-center transition-all">
          <div className="text-6xl mb-4 animate-bounce"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-green-700 dark:text-green-300 text-lg font-medium">
            Your flight booking has been successfully completed.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl dark:shadow-2xl dark:shadow-black/50 p-8 mb-6 border dark:border-gray-700 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b dark:border-gray-700">
            {/* Booking Info */}
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">
                📛 Booking Information
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Booking ID:
                  </span>{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-base">
                    {booking.bookingId}
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Status:
                  </span>{" "}
                  <span className="font-bold text-green-600 dark:text-green-400 text-base">
                    {booking.status}
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Date:
                  </span>{" "}
                  {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Traveller Info */}
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">
                👤 Traveller Details
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Name:
                  </span>{" "}
                  {booking.traveller.name}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Email:
                  </span>{" "}
                  {booking.traveller.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Phone:
                  </span>{" "}
                  {booking.traveller.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700/50">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              💳 Total Price
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ₹ {booking.lockedPrice}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link
            href="/flight"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-4 py-3 rounded-lg text-center font-bold hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition transform hover:scale-105 shadow-lg dark:shadow-xl cursor-pointer"
          >
            🔍 Search More
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-lg font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition cursor-pointer"
          >
            🖨️ Print Booking
          </button>
        </div>
      </div>
    </div>
  );
}
