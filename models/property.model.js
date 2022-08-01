const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    bedrooms: { type: String, required: true },
    bathrooms: { type: String, required: true },
    surface: { type: String, required: true },
    year: { type: String, required: true },
    price: { type: Number, required: true },
    property_image_id: { type: String },
    agent: {
      image: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      agent_image_id: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("properties", propertySchema);
