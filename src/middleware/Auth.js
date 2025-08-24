const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("Token is Invalid");
    }

    const DecodeObj = await jwt.verify(token, "TechDevs@034"); //
    const { _id } = DecodeObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not Exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.send("ERROR " + err.message);
  }
};

module.exports = {
  userAuth,
};
