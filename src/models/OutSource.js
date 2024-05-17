const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    currency: { type: String, required: true },
    experience: { type: String, required: true },
    roles: { type: String, required: true },
    department: { type: String, required: true },
    desiredCandidate: [
      {
        name: { type: String, required: true },
      },
    ],
    numberOfPerson: { type: Number },
    yearsOfExperience: { type: Number },
    currency: { type: String, required: true },
    type: { type: String, required: true },
    format: { type: String, required: true },
    location: { type: String, required: true },
    salaryFormat: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const outSourceJobsSchema = new mongoose.Schema(
  {
    providerId: { type: String },
    jobPoster: { type: mongoose.Schema.Types.ObjectId, ref: "JobPoster" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "unpaid"],
      default: "unpaid",
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    deliveryDate: { type: String },
    jobs: [jobSchema], // Define an array of job objects
  },
  { timestamps: true }
);

const OutSourceJobs = mongoose.model("OutSourceJobs", outSourceJobsSchema);

module.exports = OutSourceJobs;
