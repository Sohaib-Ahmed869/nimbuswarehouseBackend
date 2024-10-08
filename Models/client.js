const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  product_rates: {
    type: Array,
    required: true,
  },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
