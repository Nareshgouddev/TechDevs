const express = require("express");
const { userAuth } = require("../middleware/Auth");
const requestRouter = express();

requestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
  const user = await req.user;
  res.send(user.firstName + " sent connection request");
});

module.exports = requestRouter;
