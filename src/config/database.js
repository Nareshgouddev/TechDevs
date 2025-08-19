const mongoose = require("mongoose");

const ConnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ediganareshgoud406:NloPL3UBWA3JgPSm@cluster0.d3wyvjy.mongodb.net/Techdevs"
  );
};

ConnectDB();
module.exports = ConnectDB;
