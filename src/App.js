const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Naresh",
    lastName: "Goud",
    email: "naresh@gmail.com",
    password: "123Naresh",
  });
  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal Server Error");
  }
});

ConnectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is Listening in port 3000....");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
