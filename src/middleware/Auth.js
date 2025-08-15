const Auth = (req, res, next) => {
  console.log("Admin Auith checked");
  const token = "xyzjj";
  const Auth = token === "xyz";
  if (!Auth) {
    res.status(401).send("Not Auth");
  } else {
    next();
  }
};

const user = (req, res, next) => {
  console.log("User Auith checked");
  const token = "xyz";
  const Auth = token === "xyz";
  if (!Auth) {
    res.status(401).send("Not User");
  } else {
    next();
  }
};
module.exports = {
  Auth,
  user,
};
