const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  sirname: {
    type: String,
  },
  userId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  downloads: {
    type: Number,
  },
  points: {
    type: Number,
  },
  dateTime: {
    type: String,
  },
  totalAmounts: {
    type: Number,
  },
});

// collection
const Assignment = new mongoose.model("assignment", assignmentSchema);

module.exports = Assignment;
