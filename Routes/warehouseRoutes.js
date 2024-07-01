const express = require("express");
const {
  updateUsername,
  updatePassword,
  updateBranchname,
  getAllWarehouses,
  getWarehouseById,
  getWarehouse,
  updatePassword2
} = require("../Controllers/warehouseController");

const router = express.Router();

router.put("/update-username/:id", updateUsername);
router.put("/update-password/:id", updatePassword);
router.put("/update-password2", updatePassword2);
router.put("/update-branchname/:id", updateBranchname);
router.get("/", getAllWarehouses);
router.get("/get-warehouse", getWarehouseById);
router.get("/warehouse", getWarehouse);

module.exports = router;
