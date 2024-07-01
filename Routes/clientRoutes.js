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

const router = express.Router();

router.post("/add", addClient);
router.put("/update/:id", updateClient);
router.get("/", getAllClients);
router.get("/:id", getClient);
router.post("/product_rates/:id", addProductRates);
router.put("/product_rates/update/:id", updateProductRates);
router.get("/product_rates/:id", getClientRates);

module.exports = router;
