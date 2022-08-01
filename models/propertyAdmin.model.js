const mongoose = require("mongoose");

const propertyAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("property_admins", propertyAdminSchema);
