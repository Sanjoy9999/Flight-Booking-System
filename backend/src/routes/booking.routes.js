import express from "express";
import {
  createBooking,
  getBooking,
  getAllBookings,
} from "../controllers/Booking.Controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/:bookingId", getBooking);
bookingRouter.get("/", getAllBookings);

export default bookingRouter;
