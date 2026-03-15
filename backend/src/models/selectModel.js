import mongoose from "mongoose";

const selectSchema = new mongoose.Schema(
  {
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
    lockedPrice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const selectModel = mongoose.model("select", selectSchema);

export default selectModel;
