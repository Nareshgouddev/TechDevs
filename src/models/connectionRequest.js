const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromuserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // optional, but useful for population
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["ignore", "interested", "accepted", "rejected"],
    default: "ignore",
    required: true,
  },
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest; // ✅ export the model
