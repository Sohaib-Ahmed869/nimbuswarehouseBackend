const express = require("express");
const {
  addClient,
  updateClient,
  getAllClients,
  getClient,
  addProductRates,
  updateProductRates,
  getClientRates,
} = require("../Controllers/clientController");

const { verifyToken, verifyAdmin } = require("../Middlewares/auth");

const router = express.Router();

router.use(verifyToken);
router.post("/add", verifyAdmin, addClient);
router.put("/update/:id", verifyAdmin, updateClient);
router.get("/", getAllClients);
router.get("/:id", getClient);
router.post("/product_rates/:id", verifyAdmin, addProductRates);
router.put("/product_rates/update/:id", verifyAdmin, updateProductRates);
router.get("/product_rates/:id", getClientRates);

module.exports = router;
