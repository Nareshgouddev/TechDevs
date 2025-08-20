const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");
const { isValidate } = require("./utils/validator");
const bcrypt = require("bcrypt");
const validator = require("validator");
const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, gender, age } = req.body;
  try {
    isValidate(req);
    const HashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: HashPassword,
      gender,
      age,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(404).send("User Not created: " + err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("Invalid email or password");
    }
    const PasswordMatch = await bcrypt.compare(password, user.password);
    if (!PasswordMatch) {
      return res.status(401).send("Invalid email or password");
    }
    res.status(200).send("Login successful");
  } catch (err) {
    res.status(404).send("Login failed: " + err);
  }
});

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
