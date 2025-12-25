const mongoose = require("mongoose");

const ConnectDB = async () => {
  await mongoose.connect(
    ""
  );
};

ConnectDB();
module.exports = ConnectDB;
