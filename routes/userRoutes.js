const express = require("express");
const router = express.Router();
const usersController = require("../controller/usersController");
const validateCookie = require("../middleware/validateCookie");

router.route("/signup").post(usersController.createNewUser); // Handle POST request for /signup

router
  .route("/login")
  .get(validateCookie, (req, res) => {
    res.json(req.validateData);
  })
  .post(usersController.loginUser);

router.get("/", usersController.getAllUsers);
//  .get(usersController.getAllUsers)
//  .post(usersController.createNewUser)
//  .delete(usersController.deleteUser);

module.exports = router;
