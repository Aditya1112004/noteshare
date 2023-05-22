const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  cpassword: {
    type: String,
    required: true,
    unique: true,
  },
  secQue: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "profile.png",
  },
  totalPoints: {
    type: Number,
  },
  totalDownloads: {
    type: Number,
  },
});

// collection
const Register = new mongoose.model("register", candidateSchema);

module.exports = Register;
