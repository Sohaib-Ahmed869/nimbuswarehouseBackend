// controllers/authController.js

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Warehouse = require("../Models/warehouse");
const Cashier = require("../Models/cashier");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

// // Generate JWT
// const generateToken = (user) => {
//   return jwt.sign({ id: user._id, username: user.username }, secretKey);
// };

// Generate JWT
const generateToken = (user, role) => {
  return jwt.sign(
    {
      tenantId: user.tenantId,
      username: user.username,
      role: role,
      timestamp: new Date().getTime(),
    },
    secretKey
  );
};

// Signup controller
exports.signup = async (req, res) => {
  const { email, username, password, branchname } = req.body;
  const role = "tenant";
  try {
    const existingUser = await Warehouse.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // generate tenantId
    const tenantId = new mongoose.Types.ObjectId();
    const user = new Warehouse({
      tenantId,
      email,
      username,
      password,
      branchname,
    });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.log("Error: ", err);
    console.log("Request body: ", req.body);
    res.status(500).json({ message: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const role = "tenant";

  try {
    const user = await Warehouse.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    console.log("User: ", user);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user, role);
    console.log("Token: ", token);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ role: role });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: err.message });
  }
};

// cashier signup controller
exports.cashierSignup = async (req, res) => {
  const user1 = req.user;
  const { username, password } = req.body;
  const tenantId = user.tenantId;
  try {
    const existingUser = await Cashier.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new Cashier({ tenantId: user1.tenantId, username, password });
    await user.save();

    res.status(201).json({ message: "Cashier created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// cashier login controller
exports.cashierLogin = async (req, res) => {
  const { username, password } = req.body;
  const role = "cashier";

  try {
    const user = await Cashier.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user, role);
    console.log("Token: ", token);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ role: role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
