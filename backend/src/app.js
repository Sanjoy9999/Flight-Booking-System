import express from "express";
import cors from "cors";
import "./config/config.js";
import searchRouter from "./routes/searching.routes.js";
import selectRouter from "./routes/select.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Healthy server of Flight Booking System");
});

app.use("/api/search", searchRouter);
app.use("/api/flight", selectRouter);
app.use("/api/booking", bookingRouter);

export default app;
