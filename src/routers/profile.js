const express = require("express");

const profileRouter = express();

const jwt = require("jsonwebtoken");

const { validateProfileData } = require("../utils/validator");

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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("invalid Edit");
    }

    const loggedInuser = req.user;

    console.log(loggedInuser);

    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));
    await loggedInuser.save();
    res.json({
      message: `${loggedInuser.firstName},profile updated succesfully`,
      data: loggedInuser,
    });
  } catch (err) {
    res.send("ERROR" + err.message);
  }
});

module.exports = profileRouter;
