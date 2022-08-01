const mongoose = require("mongoose");
const Property = require("./property.model");

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Property,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("property_order", orderSchema);
