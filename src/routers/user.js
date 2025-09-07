const express = require("express");
const User = require("../models/user");
const userRouter = express();

const { userAuth } = require("../middleware/Auth");

const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl gender age";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromuserId", USER_SAFE_DATA);
    res.json({
      message: "Data Fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        {
          fromuserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromuserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequest.map((row) => {
      if (row.fromuserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromuserId;
    });

    res.json({ data });
  } catch (err) {
    res.send("ERROR" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const requests = await ConnectionRequest.find({
      $or: [{ fromuserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromuserId toUserId");

    const hideUserrFromFeed = new Set();

    requests.forEach((req) => {
      hideUserrFromFeed.add(req.fromuserId.toString());
      hideUserrFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserrFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      hiddenUsers: Array.from(hideUserrFromFeed),
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = userRouter;
