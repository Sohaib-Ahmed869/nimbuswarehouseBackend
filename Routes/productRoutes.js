const express = require("express");
const {
  addProduct,
  updateStock,
  getAllProducts,
  updateStatus,
  addInboundProducts,
  removeOutboundProducts,
  getAllInboundLogs,
  getAllOutboundLogs,
  getTotalSales
} = require("../Controllers/productController");

const router = express.Router();

router.post("/add", addProduct);
router.put("/stock/:id", updateStock);
router.get("/", getAllProducts);
router.put("/status/:id", updateStatus);
router.put("/inbound/:productId", addInboundProducts);
router.put("/outbound", removeOutboundProducts);
router.get("/inbound-logs", getAllInboundLogs);
router.get("/outbound-logs", getAllOutboundLogs);
router.get("/total-sales", getTotalSales);

module.exports = router;
