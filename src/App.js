const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");
const { isValidate } = require("./utils/validator");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/Auth");
const requestRouter = require("./routers/request");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
    res.status(404).send("Something Went Wrong" + err);
  }
});
app.get("/feed", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send("Error fetching users: " + err);
    });
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send("User Not found: " + err);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    if (userId) {
      const user = await User.findByIdAndDelete(userId);
    } else {
      return res.status(400).send("User ID is not exist");
    }

    res.status(200).send("user is Deleted Succesfully");
  } catch (err) {
    res.status(404).send("User Not found: " + err);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const update = req.body;
  try {
    const ALLOWED_UPADTES = [
      "skills",
      "about",
      "photoUrl",
      "firstName",
      "lastName",
    ];
    const isAllowedUpdates = Object.keys(update).every((k) =>
      ALLOWED_UPADTES.includes(k)
    );

    if (!isAllowedUpdates) {
      throw new Error("Invalid updates!");
    }

    if (update?.skills.length > 20) {
      return res.status(400).send("Skills array cannot exceed 20 items.");
    }

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("User Not updated: " + err);
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
