const Product = require("../Models/product");
const StockLog = require("../Models/stockLog");
const OutboundStockLog = require("../Models/OutboundStockLog");

const OutboundStockAndLog = async (
  tenantId,
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
      tenantId,
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
  const user = req.user;
  const { name, unit, stock } = req.body;

  try {
    //if name already exists, return an error
    const productExists = await Product.findOne({
      tenantId: user.tenantId,
      name: name,
    });
    if (productExists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = new Product({
      tenantId: user.tenantId,
      name,
      unit,
      stock,
      status: "active",
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { quantity, reason, action } = req.body; // action can be 'add' or 'remove'

  try {
    const product = await Product.findOne({ _id: id, tenantId: user.tenantId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (action === "add") {
      await product.addStockAndLog(quantity, reason);
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
  const user = req.user;

  try {
    const products = await Product.find({
      tenantId: user.tenantId,
      status: "active",
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product status
exports.updateStatus = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { status } = req.body;

  try {
    const product = await Product.findOne({ _id: id, tenantId: user.tenantId });
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
  const user = req.user;
  const { productId } = req.params; // Assuming productId is passed in the URL params
  const { quantity, reason } = req.body;

  try {
    const product = await Product.findOne({
      _id: productId,
      tenantId: user.tenantId,
    });
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
  const user = req.user;
  const { products, productNames, quantityChange, reason, clientName, total } =
    req.body;
  //first check if the products are available in stock using the checkStock method
  for (let i = 0; i < products.length; i++) {
    const product = await Product.findOne({
      _id: products[i],
      tenantId: user.tenantId,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product ${productNames[i]} not found` });
    }
    try {
      await product.checkStock(quantityChange[i]);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
  try {
    console.log(user);

    const log = await OutboundStockAndLog(
      user.tenantId,
      products,
      productNames,
      quantityChange,
      reason,
      clientName,
      total
    );

    //get the products on their ids and update their stock
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findOne({
        _id: products[i],
        tenantId: user.tenantId,
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      //call the remove stock method
      await product.removeStock(quantityChange[i]);
    }

    res.status(200).json(log);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

//get all inbound logs
exports.getAllInboundLogs = async (req, res) => {
  const user = req.user;
  try {
    const logs = await StockLog.find({ tenantId: user.tenantId });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get all outbound logs
exports.getAllOutboundLogs = async (req, res) => {
  const user = req.user;
  try {
    const logs = await OutboundStockLog.find({ tenantId: user.tenantId });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get total sales
exports.getTotalSales = async (req, res) => {
  const user = req.user;
  try {
    const logs = await OutboundStockLog.find({ tenantId: user.tenantId });
    let total = 0;
    logs.forEach((log) => {
      total += log.total;
    });
    res.status(200).json({ totalSales: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get some satistics like average per client, sales this month, sales this year, sales today
exports.getStatistics = async (req, res) => {
  const user = req.user;
  try {
    const logs = await OutboundStockLog.find({ tenantId: user.tenantId });
    let total = 0;
    let clients = {};
    let today = new Date();
    let thisMonth = today.getMonth();

    let thisYear = today.getFullYear();
    let salesToday = 0;
    let salesThisMonth = 0;
    let salesThisYear = 0;
    logs.forEach((log) => {
      total += log.total;
      if (log.clientName in clients) {
        clients[log.clientName] += log.total;
      } else {
        clients[log.clientName] = log.total;
      }
      let date = new Date(log.date);
      console.log(date.getDate());
      console.log(today);
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        salesToday += log.total;
      }

      if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
        salesThisMonth += log.total;
      }
      if (date.getFullYear() === thisYear) {
        salesThisYear += log.total;
      }
    });
    let averagePerClient = 0;
    let maxClient = "";
    let maxSales = 0;
    for (let client in clients) {
      if (clients[client] > maxSales) {
        maxSales = clients[client];
        maxClient = client;
      }
      averagePerClient += clients[client];
    }
    averagePerClient = averagePerClient / Object.keys(clients).length;
    res.status(200).json({
      totalSales: total,
      averagePerClient,
      maxClient,
      maxSales,
      salesToday,
      salesThisMonth,
      salesThisYear,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get more stats like sending a list of clients and their total sales this year and this month and today
exports.getMoreStats = async (req, res) => {
  const user = req.user;
  try {
    const logs = await OutboundStockLog.find({ tenantId: user.tenantId });
    let today = new Date();
    let thisMonth = today.getMonth();
    let thisYear = today.getFullYear();
    let clients = {};
    logs.forEach((log) => {
      let date = new Date(log.date);
      if (date.getDate() === today.getDate()) {
        if (log.clientName in clients) {
          clients[log.clientName].today += log.total;
        } else {
          console.log(clients[log.clientName]);
          clients[log.clientName] = {
            today: log.total,
            thisMonth: 0,
            thisYear: 0,
            total: 0,
          };
        }
      }

      if (date.getMonth() === thisMonth) {
        if (log.clientName in clients) {
          clients[log.clientName].thisMonth += log.total;
        } else {
          clients[log.clientName] = {
            today: 0,
            thisMonth: log.total,
            thisYear: 0,
            total: 0,
          };
        }
      }
      if (date.getFullYear() === thisYear) {
        if (log.clientName in clients) {
          clients[log.clientName].thisYear += log.total;
        } else {
          clients[log.clientName] = {
            today: 0,
            thisMonth: 0,
            thisYear: log.total,
            total: 0,
          };
        }
      }

      if (log.clientName in clients) {
        clients[log.clientName].total += log.total;
      } else {
        clients[log.clientName] = {
          today: 0,
          thisMonth: 0,
          thisYear: 0,
          total: log.total,
        };
      }
    });
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
