const asyncHandler = require("express-async-handler");
const axios = require("axios");

const guess = asyncHandler(async (req, res) => {
  try {
    const matrix = req.body;
    const response = await axios.post("http://localhost:5000/predict", {
      matrix,
    });
    const prediction = response.data.prediction;
    res.json({ prediction });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  guess,
};
