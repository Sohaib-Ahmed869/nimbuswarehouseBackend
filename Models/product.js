const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StockLog = require("./stockLog");
const outboundStockLog = require("./OutboundStockLog");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

// Method to add stock and log it
productSchema.methods.addStockAndLog = async function (quantity, reason) {
  try {
    //first convert quantity to number
    quantity = Number(quantity);
    //first convert stock to number
    this.stock = Number(this.stock);
    this.stock += quantity;
    await this.save();

    const log = new StockLog({
      product: this._id,
      productName: this.name,
      quantityChange: quantity,
      reason: reason,
    });
    await log.save();

    return log; // Return the StockLog entry if needed
  } catch (err) {
    throw new Error(err.message);
  }
};

// Method to remove stock only if there is enough stock
productSchema.methods.removeStock = async function (quantity) {
  try {
    //first convert quantity to number
    quantity = Number(quantity);
    //first convert stock to number
    this.stock = Number(this.stock);
    if (this.stock < quantity) {
      throw new Error("Not enough stock");
    }

    this.stock -= quantity;
    await this.save();

    return this.stock; // Return the updated stock if needed
  } catch (err) {
    throw new Error(err.message);
  }
};

//method to check if product is enough in stock
productSchema.methods.checkStock = async function (quantity) {
  try {
    //first convert quantity to number
    quantity = Number(quantity);
    //first convert stock to number
    this.stock = Number(this.stock);
    if (this.stock < quantity) {
      throw new Error(`Not enough stock for product ${this.name}`);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
