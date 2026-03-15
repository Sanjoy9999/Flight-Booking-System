// API configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Search flights based on filters
export async function searchFlights(filters: any) {
  const response = await fetch(`${API_BASE}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });

  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

// Select a flight and save it
export async function selectFlight(searchId: string, flightKey: string, fareId: string) {
  const response = await fetch(`${API_BASE}/api/flight/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchId, flightKey, fareId }),
  });

  if (!response.ok) throw new Error("Failed to select flight");
  return response.json();
}

// Create a booking with traveller info
export async function createBooking(searchId: string, traveller: any) {
  const response = await fetch(`${API_BASE}/api/booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchId, traveller }),
  });

  if (!response.ok) throw new Error("Booking failed");
  return response.json();
}
