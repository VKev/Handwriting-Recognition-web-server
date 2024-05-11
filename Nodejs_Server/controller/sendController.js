const e = require("express");
const asyncHandler = require("express-async-handler");
const ImageModel = require("../models/TrainImage");

const send = asyncHandler(async (req, res) => {
  if (
    req.validateData.userrole === "Admin" ||
    req.validateData.userrole === "Moderator"
  ) {
    const imageData = {
      matrix: req.body.matrix,
      label: req.body.label,
    };
    const newImage = new ImageModel(imageData);
    await ImageModel.create(newImage);
    res.json({ message: "Send data to database successful" });
  } else {
    res.json({ message: "No permission" });
  }
});

module.exports = {
  send,
};
