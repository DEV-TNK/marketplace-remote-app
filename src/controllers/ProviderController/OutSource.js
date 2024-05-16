const JobPoster = require("../../models/JobPoster");;
const outSourceJobs = require("../../models/OutSource");
const sendOutSourcingCreation = require("../../utils/sendOutSourcingCreation");

const createOutSourceJobs = async (req, res) => {
  const { providerId, jobs, } = req.body;

  if (!providerId) {
    return res.status(400).json({ message: "providerId is required" });
  }


  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
    return res
      .status(400)
      .json({ message: "jobs array is required and should not be empty" });
  }

  for (const job of jobs) {
    const { title, description, currency, experience, roles, department, desiredCandidate, numberOfPerson, yearsOfExperience, type, format, location, salaryFormat, price } = job;
    const jobDetails = { title, description, experience, currency, roles, department, desiredCandidate, numberOfPerson, yearsOfExperience, type, format, location, salaryFormat, price };

    for (const detail in jobDetails) {
      if (!jobDetails[detail]) {
        return res
          .status(400)
          .json({ message: `${detail} is required for all jobs` });
      }
    }

    if (
      !Array.isArray(desiredCandidate) ||
      desiredCandidate.length === 0 ||
      !desiredCandidate.every((candidate) => candidate.name)
    ) {
      return res.status(400).json({
        message:
          "desiredCandidate should be a non-empty array of objects with 'name' field for all jobs",
      });
    }
  }
  try {
    // Check if the job poster exists
    const outSourcePoster = await JobPoster.findOne({
      jobPosterId: providerId,
    });

    if (!outSourcePoster) {
      return res.status(400).json({
        message: "Poster profile not found. Please create a profile first.",
      });
    }

    // Create the job
    const outSourceJobsData = {
      providerId,
      jobPoster: outSourcePoster._id,
      jobs, // Assign the jobs array directly
    };

    const createdJobs = await outSourceJobs.create(outSourceJobsData);

    await JobPoster.findByIdAndUpdate(outSourcePoster._id, {
      $push: { created_OutSourcejobs: createdJobs._id },
    });
    await sendOutSourcingCreation({
      username: outSourcePoster.firstName,
      email: outSourcePoster.companyEmail,
    });

    return res
      .status(201)
      .json({ message: "OutSource Jobs Created successfully" });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getMyOutSourceJob = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: `User Id is required` });
    }
    console.log("this is user", userId);
    const jobs = await outSourceJobs
      .find({ providerId: userId })
      .sort({ createdAt: -1 })
      .exec();
    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getAOutSourceJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(400).json({
        message: "Out-Source Job Id is required",
      });
    }

    const requiredJob = await outSourceJobs.findOne({ _id: jobId }).populate({
      path: "jobPoster",
      select: "companyName companyLogo companyEmail companyContact",
    });
    if (requiredJob) {
      return res.status(200).json({ requiredJob });
    } else {
      return res.status(400).json({
        message: "Job Not found",
      });
    }
  } catch (error) {
    console.error("Error fetching department statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteOutSourceJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const job = await outSourceJobs.findOneAndDelete({
      providerId: userId,
      _id: jobId,
    });
    if (!job) {
      return res.status(404).json({ message: "Outsource job not found" });
    }

    let jobPoster = await JobPoster.findOne({ jobPosterId: userId });

    // Check if the JobPoster document exists
    if (!jobPoster) {
      return res.status(404).json({ message: "JobPoster not found" });
    }

    // Remove jobId from created_OutSourcejobs array
    jobPoster.created_OutSourcejobs = jobPoster.created_OutSourcejobs.filter(id => id.toString() !== jobId);

    // Save the updated JobPoster document
    jobPoster = await jobPoster.save();

    // Check if the document was successfully saved
    if (jobPoster) {
     
      return res.status(200).json({ message: "Outsource job deleted successfully" });
    } else {
      console.log("Error updating JobPoster");
      return res.status(500).json({ message: "Error updating JobPoster" });
    }
  } catch (error) {
    console.error("Error deleting Outsource job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOutSourceJobs,
  getMyOutSourceJob,
  getAOutSourceJob,
  deleteOutSourceJob,
};
