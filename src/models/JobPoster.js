const mongoose = require("mongoose");

const jobPosterSchema = new mongoose.Schema(
  {
    jobPosterId: {
      type: String,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyContact: { type: String, required: true },
    companyName: { type: String, required: true },
    companyWebsite: { type: String },
    companyLogo: { type: String },
    companyLocation: { type: String },
    companyType: { type: String },
    companyDesignation: { type: String },
    CompanyIndustry: { type: String, required: true },
    companyDescription: { type: String, required: true },
    created_OutSourcejobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "outSourceJobs",
      },
    ],
    created_jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtual fields are included when converting to JSON
    toObject: { virtuals: true }, // Ensure virtual fields are included when converting to object
  }
);

module.exports = mongoose.model("JobPoster", jobPosterSchema);
