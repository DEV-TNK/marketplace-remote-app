const mongoose = require("mongoose");

const saveJobSchema = new mongoose.Schema({
  user: { type: String, required: true },
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      timestamp: true,
    },
  ],
});

const SaveJob = mongoose.model("SaveJob", saveJobSchema);
module.exports = SaveJob;
