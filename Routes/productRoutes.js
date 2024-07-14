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
  getTotalSales,
  getStatistics,
  getMoreStats,
} = require("../Controllers/productController");

const { verifyToken, verifyAdmin } = require("../Middlewares/auth");

const router = express.Router();

router.use(verifyToken);
router.post("/add", verifyAdmin, addProduct);
router.put("/stock/:id", verifyAdmin, updateStock);
router.put("/status/:id", verifyAdmin, updateStatus);
router.put("/inbound/:productId", addInboundProducts);
router.get("/", getAllProducts);
router.put("/outbound", removeOutboundProducts);
router.get("/inbound-logs", getAllInboundLogs);
router.get("/outbound-logs", getAllOutboundLogs);
router.get("/total-sales", getTotalSales);
router.get("/statistics", getStatistics);
router.get("/more-stats", getMoreStats);

module.exports = router;
