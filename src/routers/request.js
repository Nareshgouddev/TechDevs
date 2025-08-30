const express = require("express");
const { userAuth } = require("../middleware/Auth");
const ConnectionRequest = require("../models/connectionRequest"); // use PascalCase for models
const requestRouter = express();
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromuserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type :" + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User Not find" });
      }
      // Check if connection already exists (both directions)
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromuserId, toUserId },
          { fromuserId: toUserId, toUserId: fromuserId },
        ],
      });

      if (existingConnection) {
        return res
          .status(400)
          .json({ message: "Connection request already exists!" });
      }

      // Create new request
      const newRequest = new ConnectionRequest({
        fromuserId,
        toUserId,
        status,
      });

      const data = await newRequest.save();
      res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(500).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInuser = req.user;
      const { status, requestId } = req.params;
      if (!loggedInuser) {
        res.status(400).json({ message: "please Login" });
      }

      const allowedstatus = ["accepted", "rejected"];
      if (!allowedstatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }
      const connectionRequestrev = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInuser._id,
        status: "interested",
      });
      if (!connectionRequestrev) {
        return res
          .status(400)
          .json({ message: "Connection Request not found" });
      }

      connectionRequestrev.status = status;

      const data = await connectionRequestrev.save();
      res.status(200).json({ message: "Connection request Accepted", data });
    } catch (err) {
      res.send("ERROR" + err.message);
    }
  }
);

module.exports = requestRouter;
