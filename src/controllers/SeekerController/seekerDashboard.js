const { Op } = require("sequelize");
const Applicant = require("../../models/Applicant");
const JobPosting = require("../../models/Job");
const Offer = require("../../models/Offer");
const User = require("../../models/Users");
const { isValidFile } = require("../../helper/multerUpload");

const getJobSeekerDashboardData = async (req, res) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send({ error: "UserId is required" });
    }

    // Total jobs applied for and new jobs applied for the month
    const totalJobsApplied = await Applicant.count({ where: { userId } });

    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentMonth - 1,
      1
    );
    const newJobsApplied = await Applicant.count({
      where: {
        userId,
        createdAt: { [Op.gte]: startOfMonth },
      },
    });

    // Total job approvals and pending jobs
    const totalJobs = await Offer.count({
      where: {
        jobSeeker: userId,
        status: "accepted",
      },
    });

    const pendingJobs = await Offer.count({
      where: {
        jobSeeker: userId,
        status: "pending",
      },
    });

    const formattedData = {
      totalJobsApplied,
      newJobsApplied,
      totalJobs,
      pendingJobs,
    };

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching jobseeker dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLastApprovedJobs = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).send({ error: "UserId is required" });
  }

  try {
    // Find the last 4 approved jobs, sorted by createdAt in descending order
    const lastApprovedJobs = await Offer.findAll({
      where: {
        jobSeeker: userId,
        status: "accepted",
      },
      order: [["offerDate", "DESC"]],
      limit: 4,
    });

    // Extract jobIds from lastApprovedJobs
    const jobIds = lastApprovedJobs.map((job) => job.jobId);

    // Fetch job details for the extracted jobIds
    const jobDetails = await JobPosting.find(
      {
        _id: { $in: jobIds },
      },
      {
        currency: 1,
        jobDescription: 1,
        jobType: 1,
        jobSalary: 1,
      }
    );

    const result = lastApprovedJobs.map((job) => {
      const jobDetail = jobDetails.find(
        (detail) => detail._id.toString() === job.jobId.toString()
      );
      return {
        currency: jobDetail.currency,
        jobDescription: jobDetail.jobDescription,
        jobType: jobDetail.jobType,
        jobSalary: jobDetail.jobSalary,
        offerDate: job.offerDate,
      };
    });
    return res.json(result);
  } catch (error) {
    console.error("Error fetching the last 4 approved jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadSeekerImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    let imageLink;

    if (req.file) {
      const newImage = req.file;
      if (!isValidFile(newImage)) {
        return res.status(400).json({ message: "Invalid image file" });
      }

      imageLink = newImage.path;
    }

    if (imageLink) {
      user.imageUrl = imageLink;
      await user.save();
      return res
        .status(200)
        .json({ message: "Image uploaded successfully", user });
    } else {
      return res.status(400).json({ message: "No image file provided" });
    }
  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getJobSeekerDashboardData,
  getLastApprovedJobs,
  uploadSeekerImage,
};
