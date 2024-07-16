const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockLogSchema = new Schema({
    tenantId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
      },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantityChange: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    reason: {
        type: String,
    },
});

const StockLog = mongoose.model('StockLog', stockLogSchema);

module.exports = StockLog;
