"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="text-center px-4 max-w-2xl mx-auto">
        <div className="mb-6 text-6xl animate-bounce">✈️</div>
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 tracking-tight">
          Flight Booking System
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed">
          Search and book your perfect flight with ease
        </p>
        <Link
          href="/flight"
          className="inline-block px-8 md:px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition transform hover:scale-110 active:scale-95 shadow-lg dark:shadow-2xl dark:shadow-blue-500/30 cursor-pointer"
        >
          🚀 Start Searching Now
        </Link>
      </div>
    </div>
  );
}
