const Warehouse = require("../Models/warehouse");

// Update username
exports.updateUsername = async (req, res) => {
  const user = req.user;
  const { username } = req.body;

  try {
    const warehouse = await Warehouse.findOne({ tenantId: user.tenantId });
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
  const user = req.user;
  const { password } = req.body;

  try {
    const warehouse = await Warehouse.findOne({ tenantId: user.tenantId });
    if (!warehouse) {
      return res.status(404).json({ message: "User not found" });
    }

    await warehouse.updatePassword(password);

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

    await warehouse.updatePassword(password);

    res
      .status(200)
      .json({ message: "Password updated successfully", warehouse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update branch name
exports.updateBranchname = async (req, res) => {
  const user = req.user;
  const { branchname } = req.body;

  try {
    const warehouse = await Warehouse.findOne({ tenantId: user.tenantId });
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
  const user = req.user;
  //get warehouse by id
  console.log("TenantId: ", user.tenantId);
  const warehouse = await Warehouse.findOne({ tenantId: user.tenantId });
  res.status(200).json(warehouse);
};

//send token to get warehouse
exports.getWarehouse = async (req, res) => {
  const user = req.user;
  const warehouse = await Warehouse.findOne({ tenantId: user.tenantId });
  res.status(200).json(warehouse);
};
