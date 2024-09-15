const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
});
const certificateSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String },
});

const serviceProviderSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  emailAddress: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  userImage: { type: String },
  title: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  country: { type: String },
  language: { type: String },
  responseTime: { type: String },
  date: { type: Date, default: Date.now },
  skills: [{ type: String }],
  certification: [certificateSchema],
  portfolio: [PortfolioSchema],
  serviceRequests: [{ type: Number }],
});

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

module.exports = ServiceProvider;
