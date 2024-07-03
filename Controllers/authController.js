// controllers/authController.js

const jwt = require("jsonwebtoken");
const Warehouse = require("../Models/warehouse");
const Cashier = require("../Models/cashier");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, secretKey);
};

// Signup controller
exports.signup = async (req, res) => {
  const { email, username, password, branchname } = req.body;

  try {
    const existingUser = await Warehouse.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new Warehouse({ email, username, password, branchname });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { username, password } = req.body;

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

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: err.message });
  }
};

// cashier signup controller
exports.cashierSignup = async (req, res) => {
  const { username, password } = req.body;
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const warehouseOwner = decoded.id;

  try {
    const existingUser = await Cashier.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new Cashier({ username, password, warehouseOwner });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// cashier login controller
exports.cashierLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Cashier.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
