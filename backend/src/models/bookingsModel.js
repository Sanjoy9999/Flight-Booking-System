import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    searchId: {
      type: String,
      required: true,
    },
    flightKey: {
      type: String,
      required: true,
    },
    fareId: {
      type: String,
      required: true,
    },
    flightData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    selectedFare: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    traveller: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      dob: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        enum: ["M", "F", "O"],
        required: true,
      },
      passport: String,
    },
    lockedPrice: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "PENDING", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  {
    timestamps: true,
  },
);

const bookingModel = mongoose.model("booking", bookingSchema);

export default bookingModel;
