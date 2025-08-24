const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not Strong enough");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 15,
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
      trim: true,
      validate: {
        validator: function (val) {
          return /^(male|female|other)$/i.test(val);
        },
        message: (props) => `${props.value} gender not valid!`,
      },
    },
    photoUrl: {
      type: String,
      trim: true,
      default: "https://example.com/default-photo.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "No information provided",
      trim: true,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Techdevs@034", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validPassword = async function (userInputpassword) {
  const user = this;
  const passwordHash = user.password;
  const ispasswordValid = await bcrypt.compare(userInputpassword, passwordHash);
  return ispasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
