// Filter flights based on user criteria
export function filterFlights(flights, filters) {
  let results = flights;

  // Filter by source city
  if (filters.source) {
    results = results.filter((flight) =>
      flight.sourceCity.toLowerCase().includes(filters.source.toLowerCase()),
    );
  }

  // Filter by destination city
  if (filters.destination) {
    results = results.filter((flight) =>
      flight.destinationCity
        .toLowerCase()
        .includes(filters.destination.toLowerCase()),
    );
  }

  // Filter by departure date
  if (filters.departureDate) {
    results = results.filter((flight) => {
      const flightDate = new Date(flight.departureTime)
        .toISOString()
        .split("T")[0];
      const filterDate = new Date(filters.departureDate)
        .toISOString()
        .split("T")[0];
      return flightDate === filterDate;
    });
  }

  // Filter by max price
  if (filters.maxPrice) {
    results = results.filter((flight) => flight.price <= filters.maxPrice);
  }

  // Filter by number of stops
  if (filters.stops !== undefined && filters.stops !== null) {
    results = results.filter((flight) => flight.stops === filters.stops);
  }

  // Filter by departure time range
  if (filters.departureTimeMin !== undefined) {
    results = results.filter((flight) => {
      const departureHour = new Date(flight.departureTime).getHours();
      return departureHour >= filters.departureTimeMin;
    });
  }

  if (filters.departureTimeMax !== undefined) {
    results = results.filter((flight) => {
      const departureHour = new Date(flight.departureTime).getHours();
      return departureHour <= filters.departureTimeMax;
    });
  }

  return results;
}

// Sort flights by field
export function sortFlights(flights, sortBy) {
  const sorted = [...flights];

  if (sortBy === "price") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === "duration") {
    sorted.sort((a, b) => a.duration - b.duration);
  } else if (sortBy === "departure") {
    sorted.sort(
      (a, b) =>
        new Date(a.departureTime).getTime() -
        new Date(b.departureTime).getTime(),
    );
  } else if (sortBy === "arrival") {
    sorted.sort(
      (a, b) =>
        new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime(),
    );
  }

  return sorted;
}
