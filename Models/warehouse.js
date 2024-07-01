// models/Warehouse.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const oneMonthFromNow = () => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

// Define the User schema
const warehouseSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
  branchname: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    default: 20000,
  },
  rent_due: {
    type: Date,
    default: oneMonthFromNow,
  },
  rent_paid: {
    type: Boolean,
    default: true,
  },
});

// Hash password before saving
warehouseSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//update password
warehouseSchema.methods.updatePassword = async function (password) {
  this.password = password;
  await this.save();
};

// Compare passwords
warehouseSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
