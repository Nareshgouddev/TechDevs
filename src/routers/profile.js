const express = require("express");

const profileRouter = express();

const jwt = require("jsonwebtoken");
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

module.exports = profileRouter;
