const validator = require("validator");

const isValidate = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and Last name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateProfileData = (req) => {
  const ALLOWED_UPDATES = ["firstName", "lastName", "skills", "age"];

  const isValidateprofile = Object.keys(req.body).every((field) => [
    ALLOWED_UPDATES.includes(field),
  ]);
  return isValidateprofile;
};

module.exports = {
  isValidate,
  validateProfileData,
};
