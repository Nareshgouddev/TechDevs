const express = require("express");
const ConnectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

//In this we use Async Await in all the Api's beacause MongoDB with Mongoose
//is asynchronous and we need to wait for the operations to complete before sending a response.

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(404).send("User Not created: " + err);
  }
});

//Get by email
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

//find by Id and Update
app.put("/user", async (req, res) => {
  const userId = req.body._id;
  const update = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, update);
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
