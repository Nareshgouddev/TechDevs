const mongoose = require("mongoose");

const connectionRequest = mongoose.Schema({
  fromuserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  touserId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  status: {
    type: String,
    enum: {
      value: ["ignore", "intrested", "accepted", "rejected"],
      required: true,
    },
  },
});

const connectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequest
);

module.exports = connectionRequest;
