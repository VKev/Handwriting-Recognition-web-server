const asyncHandler = require("express-async-handler");

const guess = asyncHandler(async (req, res) => {
  const matrix = req.body;
});

module.exports = {
  guess,
};
