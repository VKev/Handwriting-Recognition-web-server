const express = require("express");
const router = express.Router();
const guessController = require("../controller/guessController");

router.post("/", guessController.guess);

module.exports = router;
