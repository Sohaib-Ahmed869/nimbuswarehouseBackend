const Product = require("../Models/product");
const StockLog = require("../Models/stockLog");
const OutboundStockLog = require("../Models/OutboundStockLog");

const OutboundStockAndLog = async (
  products,
  productNames,
  quantityChange,
  reason,
  clientName,
  total
) => {
  try {
    // Check if there is enough stock for all products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const quantity = quantityChange[i];
      if (product.stock < quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }
    }

    // Remove stock for all products
    // for (let i = 0; i < products.length; i++) {
    //   const product = products[i];
    //   const quantity = quantityChange[i];
    //   product.stock -= quantity;
    //   await product.save();
    // }

    // Log the outbound stock
    const log = new OutboundStockLog({
      products,
      productNames,
      quantityChange,
      reason,
      clientName,
      total,
    });
    await log.save();

    return log;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, unit, stock } = req.body;

  try {
    const product = new Product({ name, unit, stock });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, reason, action } = req.body; // action can be 'add' or 'remove'

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (action === "add") {
      await product.addStock(quantity, reason);
    } else if (action === "remove") {
      await product.removeStock(quantity, reason);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = status;
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add inbound products (increase stock) and log
exports.addInboundProducts = async (req, res) => {
  const { productId } = req.params; // Assuming productId is passed in the URL params
  const { quantity, reason } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const log = await product.addStockAndLog(quantity, reason);

    res.status(200).json({ product, log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove outbound products (decrease stock) and log
exports.removeOutboundProducts = async (req, res) => {
  const { products, productNames, quantityChange, reason, clientName, total } =
    req.body;
  console.log(
    products,
    productNames,
    quantityChange,
    reason,
    clientName,
    total
  );
  try {
    const log = await OutboundStockAndLog(
      products,
      productNames,
      quantityChange,
      reason,
      clientName,
      total
    );

    res.status(200).json(log);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

//get all inbound logs
exports.getAllInboundLogs = async (req, res) => {
  try {
    const logs = await StockLog.find();
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all outbound logs
exports.getAllOutboundLogs = async (req, res) => {
  try {
    const logs = await OutboundStockLog.find();
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get total sales
exports.getTotalSales = async (req, res) => {
  try {
    const logs = await OutboundStockLog.find();
    let total = 0;
    logs.forEach((log) => {
      total += log.total;
    });
    res.status(200).json({totalSales: total});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
