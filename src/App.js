const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");
const { isValidate } = require("./utils/validator");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/Auth");

// Routers
const requestRouter = require("./routers/request");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");

// Other imports
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cookieParser());
app.use(express.json());

// Use Routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  const user = await User.find({ email: userEmail });
  try {
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(404).send("Something Went Wrong " + err);
  }
});

// Get all users
app.get("/feed", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send("Error fetching users: " + err);
    });
});

// Get user by ID
app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send("User Not found: " + err);
  }
});

// Delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    if (userId) {
      await User.findByIdAndDelete(userId);
    } else {
      return res.status(400).send("User ID does not exist");
    }
    res.status(200).send("User is Deleted Successfully");
  } catch (err) {
    res.status(404).send("User Not found: " + err);
  }
});

// Update user
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const update = req.body;
//   try {
//     const ALLOWED_UPDATES = [
//       "skills",
//       "about",
//       "photoUrl",
//       "firstName",
//       "lastName",
//     ];
//     const isAllowedUpdates = Object.keys(update).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );

//     if (!isAllowedUpdates) {
//       throw new Error("Invalid updates!");
//     }

//     if (update?.skills && update.skills.length > 20) {
//       return res.status(400).send("Skills cannot exceed 20 items.");
//     }

//     await User.findByIdAndUpdate(userId, update, {
//       new: true,
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(404).send("User Not updated: " + err);
//   }
// });

// DB Connection
ConnectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is Listening on port 3000....");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
