# Flight Booking System

## Overview

A full-stack flight booking application that allows users to search, select, and book flights. It features a Node.js/Express backend that serves a REST API and a Next.js frontend. The system uses a static JSON file for flight data and MongoDB to store selections and bookings.

## Features

- **Flight Search:** Find flights with filters for price, stops, and departure time.
- **Flight Selection:** Choose a specific flight and fare from the results.
- **Traveller Details:** Enter passenger information to proceed with a booking.
- **Booking Confirmation:** Creates a final booking and displays a confirmation summary.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose

## Architecture

`Next.js (UI) → Node.js REST API → MongoDB`

## Deployment Links

- Frontend: https://flights-booking-system.vercel.app
- Backend: https://flight-booking-backend-w0bl.onrender.com

## Project Structure

```
/
├── backend/
│   ├── src/
│   └── data/
└── frontend/
    ├── app/
    └── components/
```

## Installation

**Backend**

```bash
cd backend
npm install
npm start
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**Backend (`.env`)**

```
MONGO_URI=mongodb://localhost:27017/flight-booking
PORT=5000
```

**Frontend (`.env.local`)**

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Endpoints

- `POST /api/search`
- `POST /api/flight/select`
- `POST /api/booking`

## Test Data

A guaranteed working search based on `flight.json`:

- **Route:** DEL → SHJ
- **Date:** 2026-03-02

## Screens / Flow

1.  Search for flights on the main page.
2.  Select a flight and fare from the results.
3.  Enter traveller details on the passenger form.
4.  View the final booking confirmation.
