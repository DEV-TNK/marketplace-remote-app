const mongoose = require("mongoose");

const seekerServices = new mongoose.Schema(
  {
    serviceHeading: { type: String, required: true },
    serviceName: { type: String, required: true },
    seekerId: { type: Number },
    description: { type: String, required: true },
    serviceUrl: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    image: { type: String, required: true },
    currency: { type: String, required: true },
    experience: { type: String, required: true },
    benefit: [
      {
        name: { type: String, required: true },
      },
    ],
    department: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    serviceLogo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "Non active"],
      default: "active",
    },
    totalJobDone: { type: Number, default: 0 },
    jobSalaryFormat: { type: String, required: true },
    price: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);


module.exports = JobPosting = mongoose.model("SeekerServices", seekerServices);
