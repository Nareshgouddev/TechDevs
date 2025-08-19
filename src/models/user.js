const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
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
  },
  about: {
    type: String,
    default: "No information provided",
    trim: true,
  },
  skills: {
    type: [String],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
