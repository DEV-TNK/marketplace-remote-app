const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobApplicants: { type: Number, default: 0 },
    desiredCandidate: [
      {
        name: { type: String, required: true },
      },
    ],
    jobRoles: { type: String, required: true },
    jobExperience: [
      {
        name: { type: String, required: true },
      },
    ],
    jobPerksAndBenefits: [
      {
        name: { type: String, required: true },
      },
    ],
    jobResponsibilities: [
      {
        name: { type: String, required: true },
      },
    ],
    currency: { type: String, required: true },
    department: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    jobFormat: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "unpaid"],
      default: "unpaid",
    },
    amountAvalabilityStatus: {
      type: String,
      enum: ["false", "true"],
      default: "false",
    },
    jobSalary: { type: String, required: true },
    jobSalaryFormat: { type: String, required: true },
    jobDescription: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    jobPoster: { type: mongoose.Schema.Types.ObjectId, ref: "JobPoster" },
  },
  {
    timestamps: true,
  }
);

module.exports = JobPosting = mongoose.model("JobPosting", jobPostingSchema);
