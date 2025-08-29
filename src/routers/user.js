const express = require("express");

const userRouter = express();

const { userAuth } = require("../middleware/Auth");

const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: "loggedInUser._id",
      status: "interested",
    }).populate("fromUserId", "firstName lastName gender age");
    res.json({
      message: "Data Fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    req.status(400).send("ERROR:" + err.message);
  }
});

module.exports = userRouter;
