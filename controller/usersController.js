const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const session = require("express-session");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res.json({ message: "All fields are required" });
  }
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.json({ message: "Duplicate username" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPwd, roles: "Normie" };

  const user = await User.create(userObject);

  if (user) {
    res
      .status(201)
      .json({ message: `New user ${username} created`, success: true });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id: id, username, roles, active, password } = req.body;
  if (!id || !username || !roles || typeof active !== "boolean") {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id: id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await User.findOneAndDelete({ _id: id });

  if (result) {
    const reply = `Username ${result.username} with ID ${result._id} deleted`;
    res.json(reply);
  } else {
    console.log("No user found to delete");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (req.session && req.session.authenticated) {
    return res.json(req.session);
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ message: "Invalid username or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({ message: "Invalid username or password" });
  }

  req.session.authenticated = true;
  req.session.userrole = user.roles;
  req.session.username = user.username;

  res.status(200).json({
    message: "Login successful",
    roles: user.roles,
    session_user: user._id,
    username: user.username,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Error logging out");
    } else {
      res.send("Logout successful");
    }
  });
});

module.exports = {
  logoutUser,
  loginUser,
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
