const Cashier = require("../Models/cashier");
const Warehouse = require("../Models/warehouse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.JWT_SECRET;

//cashier delete controller
exports.deleteCashier = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const cashier = await Cashier.findOne({ _id: id, tenantId: user.tenantId });
    if (!cashier) {
      return res.status(404).json({ message: "Cashier not found" });
    }

    await Cashier.deleteOne({ _id: id, tenantId: user.tenantId });
    res.status(200).json({ message: "Cashier deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all cashiers controller
exports.getAllCashiers = async (req, res) => {
  const user = req.user;
  try {
    const cashiers = await Cashier.find({ tenantId: user.tenantId });
    res.status(200).json(cashiers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update cashier password controller
exports.updatePassword = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { password } = req.body;

  try {
    const cashier = await Cashier.findOne({ _id: id, tenantId: user.tenantId });
    if (!cashier) {
      return res.status(404).json({ message: "Cashier not found" });
    }

    cashier.updatePassword(password);

    res.status(200).json({ message: "Password updated successfully", cashier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
