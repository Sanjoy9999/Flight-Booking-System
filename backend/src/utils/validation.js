// Validate flight search filters
export function validateSearchFilters(filters) {
  const errors = [];

  if (!filters.source) {
    errors.push("Source city is required");
  }
  if (!filters.destination) {
    errors.push("Destination city is required");
  }
  if (!filters.departureDate) {
    errors.push("Departure date is required");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// Validate flight selection
export function validateFlightSelection(data) {
  const errors = [];

  if (!data.searchId) errors.push("searchId is required");
  if (!data.flightKey) errors.push("flightKey is required");
  if (!data.fareId) errors.push("fareId is required");

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// Validate booking data
export function validateBookingData(data) {
  const errors = [];

  if (!data.searchId) errors.push("searchId is required");
  if (!data.traveller) errors.push("traveller information is required");

  if (data.traveller) {
    if (!data.traveller.name) errors.push("Name is required");
    if (!data.traveller.email) errors.push("Email is required");
    if (!data.traveller.phone) errors.push("Phone is required");
    if (!data.traveller.dob) errors.push("Date of birth is required");
    if (!data.traveller.gender) errors.push("Gender is required");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}
