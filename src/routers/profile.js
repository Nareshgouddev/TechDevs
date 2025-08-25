const express = require("express");

const profileRouter = express();

const jwt = require("jsonwebtoken");
const validateProfileData = require("../utils/validator");
const { userAuth } = require("../middleware/Auth");

profileRouter.post("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not Exist");
    }
    res.send(user);
  } catch (err) {
    res.send("ERROR" + err.Message);
  }
});

profileRouter.patch("/prifile/edit", userAuth, (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("invalid Edit");
    }
    const loggedInuser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));
    res.send("profile updated succesfully");
  } catch (err) {
    res.send("ERROR" + err.Message);
  }
});

module.exports = profileRouter;
