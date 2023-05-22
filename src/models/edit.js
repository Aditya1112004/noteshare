const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: {
    type: String,
  },
  profilePic: {
    type: String,
  },
});

// collection
const proedit = new mongoose.model("proedit", profileSchema);

module.exports = proedit;
