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

const { verifyToken, verifyAdmin } = require("../Middlewares/auth");

const router = express.Router();

router.use(verifyToken);
router.put("/update-username", verifyAdmin, updateUsername);
router.put("/update-password", verifyAdmin, updatePassword);
router.put("/update-password2", verifyAdmin, updatePassword2);
router.put("/update-branchname", verifyAdmin, updateBranchname);
router.get("/", getAllWarehouses);
router.get("/get-warehouse", getWarehouseById);
router.get("/warehouse", getWarehouse);

module.exports = router;
