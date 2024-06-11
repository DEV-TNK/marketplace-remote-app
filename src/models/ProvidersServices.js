const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema({
  currency: String,
  type: String,
  packages: [
    {
      header: String,
      shortDescription: String,
      price: Number,
      deliveryTime: String,
    },
  ],
});

const providerServicesSchema = new mongoose.Schema(
  {
    header: { type: String, required: true },
    userId: { type: Number, required: true },
    description: { type: String, required: true },
    backgroundCover: [{ type: String, required: true }],
    likes: { type: Number, default: 0 },
    format: String,
    department: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "Non active"],
      default: "active",
    },
    totalJobDone: { type: Number, default: 0 },
    pricing: [pricingSchema],
  },
  {
    timestamps: true,
  }
);

const ProviderService = mongoose.model(
  "ProviderService",
  providerServicesSchema
);

module.exports = ProviderService;
