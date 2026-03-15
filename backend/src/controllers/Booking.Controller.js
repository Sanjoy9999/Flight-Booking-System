import bookingModel from "../models/bookingsModel.js";
import selectModel from "../models/selectModel.js";
import { generateBookingId } from "../utils/bookingHelpers.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { searchId, traveller } = req.body;

    // Validate required fields
    if (!searchId || !traveller) {
      return res.status(400).json({
        success: false,
        error: "Missing searchId or traveller",
      });
    }

    // Validate traveller info
    if (
      !traveller.name ||
      !traveller.email ||
      !traveller.phone ||
      !traveller.dob ||
      !traveller.gender
    ) {
      return res.status(400).json({
        success: false,
        error: "Incomplete traveller information",
      });
    }

    // Get selected flight
    const selectedFlight = await selectModel.findOne({ searchId });
    if (!selectedFlight) {
      return res.status(404).json({
        success: false,
        error: "No flight selected",
      });
    }

    // Create booking
    const booking = new bookingModel({
      bookingId: generateBookingId(),
      searchId: selectedFlight.searchId,
      flightKey: selectedFlight.flightKey,
      fareId: selectedFlight.fareId,
      flightData: selectedFlight.flightData,
      selectedFare: selectedFlight.selectedFare,
      traveller: {
        name: traveller.name,
        email: traveller.email,
        phone: traveller.phone,
        dob: traveller.dob,
        gender: traveller.gender,
        passport: traveller.passport || null,
      },
      lockedPrice: selectedFlight.lockedPrice,
      status: "CONFIRMED",
    });

    await booking.save();

    res.json({
      success: true,
      message: "Booking confirmed",
      data: {
        bookingId: booking.bookingId,
        searchId: booking.searchId,
        traveller: booking.traveller,
        lockedPrice: booking.lockedPrice,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get booking by ID
export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      totalBookings: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
