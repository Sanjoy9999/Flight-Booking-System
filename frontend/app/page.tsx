"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Flight Booking System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Search and book your perfect flight
        </p>
        <Link
          href="/flight"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Start Searching
        </Link>
      </div>
    </div>
  );
}
