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
    default: Date('2024-09-25T10:00:00.000Z')
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
