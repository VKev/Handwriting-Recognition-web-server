const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  matrix: {
    type: [[Number]],
    required: true,
  },
  label: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("TrainImage", imageSchema);
