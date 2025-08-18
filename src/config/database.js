const mongoose = require("mongoose");
const { Connect } = require("vite");

const ConnectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ediganareshgoud406:<db_password>@cluster0.d3wyvjy.mongodb.net/Techdevs"
  );
};

ConnectDB();
module.exports = ConnectDB;
