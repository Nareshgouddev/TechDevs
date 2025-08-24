const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const { isValidate } = require("../utils/validator");
const authRouter = express();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
    const PasswordMatch = await user.validPassword(password);
    if (!PasswordMatch) {
      return res.status(401).send("Invalid email or password");
    }
    const token = await user.getJWT();

    res.cookie("token", token);
    res.status(200).send("Login successful");
  } catch (err) {
    res.status(404).send("Login failed: " + err);
  }
});

authRouter.post("/logout", async (req, res) => {
  //   const { email, password } = req.body;
  //   const user = await User.findOne({ email: email });
  //   const token = await user.getJWT();

  res.clearCookie("token");
  res.status(200).send("Logout successful");
});

module.exports = authRouter;
