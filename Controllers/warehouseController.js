const Warehouse = require("../Models/warehouse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.JWT_SECRET;
//send token to get warehouse
exports.getWarehouse = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const warehouse = await Warehouse.findById(decoded.id);
  res.status(200).json(warehouse);
};

// Update username
exports.updateUsername = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "User not found" });
    }

    warehouse.username = username;
    await warehouse.save();

    res
      .status(200)
      .json({ message: "Username updated successfully", warehouse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "User not found" });
    }

    warehouse.updatePassword(password);

    res
      .status(200)
      .json({ message: "Password updated successfully", warehouse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePassword2 = async (req, res) => {
  const email = req.body.email;
  const { password } = req.body;

  try {
    const warehouse = await Warehouse.findOne({
      email: email,
    });
    if (!warehouse) {
      return res.status(404).json({ message: "User not found" });
    }

    warehouse.updatePassword(password);

    res
      .status(200)
      .json({ message: "Password updated successfully", warehouse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update branch name
exports.updateBranchname = async (req, res) => {
  const { id } = req.params;
  const { branchname } = req.body;

  try {
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "User not found" });
    }

    warehouse.branchname = branchname;
    await warehouse.save();

    res
      .status(200)
      .json({ message: "Branch name updated successfully", warehouse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get warehouse all warehouses
exports.getAllWarehouses = async (req, res) => {
  try {
    const warehouse = await Warehouse.find();
    res.status(200).json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//recieve token and return warehouse
exports.getWarehouseById = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //get warehouse by id
  const warehouse = await Warehouse.findById(decoded.id);
  res.status(200).json(warehouse);
};
