const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outboundstockLogSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  products: {
    type: Array,
    required: true,
  },
  productNames: {
    type: Array,
    required: true,
  },
  quantityChange: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  reason: {
    type: String,
  },
  clientName: {
    type: String,
  },
  total: {
    type: Number,
  },
});

const outboundStockLog = mongoose.model(
  "outboundStockLog",
  outboundstockLogSchema
);

module.exports = outboundStockLog;
