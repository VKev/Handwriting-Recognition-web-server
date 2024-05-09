const express = require("express");
const router = express.Router();
const usersController = require("../controller/usersController");
const validateCookie = require("../middleware/validateCookie");

router.route("/signup").post(usersController.createNewUser); // Handle POST request for /signup

router
  .route("/login")
  .get(validateCookie, sendValidate)
  .post(usersController.loginUser);

router.route("/logout").get(usersController.logoutUser);

router.get("/", usersController.getAllUsers);
//  .get(usersController.getAllUsers)
//  .post(usersController.createNewUser)
//  .delete(usersController.deleteUser);
function sendValidate(req, res) {
  res.json(req.validateData);
}

module.exports = router;
