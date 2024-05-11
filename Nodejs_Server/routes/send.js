const express = require("express");
const router = express.Router();
const sendController = require("../controller/sendController");
const validateCookie = require("../middleware/validateCookie");

router.post("/", validateCookie, sendController.send);

module.exports = router;
