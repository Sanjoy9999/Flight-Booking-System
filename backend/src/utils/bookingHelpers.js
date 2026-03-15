// Generate unique booking ID
export function generateBookingId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).slice(2, 8);
  return `BOOKING-${timestamp}-${randomStr}`.toUpperCase();
}

// Format flight details for booking confirmation
export function formatFlightForBooking(flight) {
  return {
    airline: flight.airline,
    flightNumber: flight.flightNumber,
    source: flight.source,
    destination: flight.destination,
    sourceCity: flight.sourceCity,
    destinationCity: flight.destinationCity,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    duration: flight.duration,
    stops: flight.stops,
    price: flight.price,
  };
}

// Create booking object from selected flight
export function createBookingFromSelection(selectedFlight, traveller) {
  return {
    bookingId: generateBookingId(),
    searchId: selectedFlight.searchId,
    flightKey: selectedFlight.flightKey,
    fareId: selectedFlight.fareId,
    flightDetails: formatFlightForBooking(selectedFlight.flight),
    traveller: {
      name: traveller.name,
      email: traveller.email,
      phone: traveller.phone,
      dob: traveller.dob,
      gender: traveller.gender,
      passport: traveller.passport || "",
    },
    totalPrice: selectedFlight.flight.price,
    status: "confirmed",
    createdAt: new Date(),
  };
}
