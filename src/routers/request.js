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
      const fromuserId = req.user._id; // ✅ mongoose uses _id (not _Id)
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"]; // ✅ fix typo: "ingored"
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

      const data = await newRequest.save(); // ✅ save the instance
      res.json({
        message: "Connection Request Sent Successfully",
        data,
      });
    } catch (err) {
      res.status(500).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
