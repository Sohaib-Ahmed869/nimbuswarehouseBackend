const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const cashierSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // warehouseOwner: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Warehouse",
  //   required: true,
  // },
});

// Hash password before saving
cashierSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//update password
cashierSchema.methods.updatePassword = async function (password) {
  this.password = password;
  await this.save();
};

// Method to check password
cashierSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const Cashier = mongoose.model("Cashier", cashierSchema);

module.exports = Cashier;
