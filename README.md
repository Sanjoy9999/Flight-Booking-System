# Flight Booking System

A full-stack MERN application for searching, viewing, and booking flights.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: Next.js, React, TypeScript

## Setup & Installation

1. **Install Backend**

   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Create `.env` in backend directory:

```
MONGO_URI=mongodb://localhost:27017/flight-booking
PORT=5000
NODE_ENV=development
```

Create `.env.local` in frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access at `http://localhost:3000`

## API Endpoints

- `GET /api/searching/flights` - Get all flights
- `GET /api/select/flights/:id` - Get flight details
- `POST /api/booking/create` - Create booking
- `GET /api/booking/:id` - Get booking details
