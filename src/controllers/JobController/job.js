const Job = require("../../models/Job");
const JobPoster = require("../../models/JobPoster");
const ProviderService = require("../../models/ProvidersServices");
const SaveJob = require("../../models/saveJob");


const createJob = async (req, res) => {
  const {
    jobPosterId,
    jobTitle,
    jobRoles,
    jobFormat,
    jobApplicants,
    jobExperience,
    jobPerksAndBenefits,
    jobResponsibilities,
    currency,
    department,
    jobLocation,
    jobType,
    jobSalary,
    jobDescription,
    deliveryDate,
    desiredCandidate,
    jobSalaryFormat,
  } = req.body;

  const details = [
    "jobPosterId",
    "jobTitle",
    "jobRoles",
    "jobExperience",
    "jobPerksAndBenefits",
    "jobResponsibilities",
    "currency",
    "department",
    "jobLocation",
    "jobType",
    "jobSalary",
    "jobFormat",
    "jobDescription",
    "deliveryDate",
    "desiredCandidate",
    "jobSalaryFormat",
  ];

  for (const detail of details) {
    if (!req.body[detail]) {
      return res.status(400).json({ message: `${detail} is required` });
    }
  }

  try {
    // Check if the job poster exists
    const jobposter = await JobPoster.findOne({ jobPosterId });

    if (!jobposter) {
      return res.status(400).json({
        message: "Job poster profile not found. Please create a profile first.",
      });
    }

    // Create the job
    const job = await Job.create({
      jobTitle,
      jobApplicants,
      jobExperience,
      jobResponsibilities,
      jobPerksAndBenefits,
      currency,
      jobRoles,
      department,
      jobLocation,
      jobType,
      jobSalary,
      jobSalaryFormat,
      jobFormat,
      jobDescription,
      deliveryDate,
      desiredCandidate,
      jobPoster: jobposter._id,
    });

    await JobPoster.findByIdAndUpdate(jobposter._id, {
      $push: { created_jobs: job._id },
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const userCountry = req.body.country;

    const jobs = await Job.find({ status: "Pending" })
      .populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




const getLandingPageJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Pending" })
      .populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const allJobsCategory = async (req, res) => {
  try {
    const allDepartments = await JobPosting.aggregate([
      {
        $group: {
          _id: "$department",
          totalJobs: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ allDepartments });
  } catch (error) {
    console.error("Error fetching department statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const allJobs = async (req, res) => {
  try {
    const totalJobs = await JobPosting.countDocuments();

    res.status(200).json({ totalJobs });
  } catch (error) {
    console.error("Error fetching total count of job postings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const getAJob = async (req, res) => {
//   try {
//     const jobId = req.params.jobId;
//     if (!jobId) {
//       return res.status(400).json({
//         message: "Job Id is required",
//       });
//     }

//     const requiredJob = await Job.findOne({ _id: jobId }).populate({
//       path: "jobPoster",
//       select: "companyName companyLogo",
//     });
//     if (requiredJob) {
//       return res.status(200).json({ requiredJob });
//     } else {
//       return res.status(400).json({
//         message: "Job Not found",
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching department statistics:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getAJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId) {
      return res.status(400).json({
        message: "Job Id is required",
      });
    }
    const [requiredJob, department] = await Promise.all([
      Job.findOne({ _id: jobId }).populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      }),
      Job.findOne({ _id: jobId }).select("department"),
    ]);

    if (!requiredJob) {
      return res.status(404).json({
        message: "Job Not found",
      });
    }
    const similarJobs = await Job.find({
      _id: { $ne: jobId },
      department: department.department,
      status: "Pending",
    }).limit(4);

    return res.status(200).json({ requiredJob, similarJobs });
  } catch (error) {
    console.error("Error fetching department statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const totalJobsAndNewestJob = async (req, res) => {
  const { providerId } = req.params;

  try {
    // Find the job provider by ID
    const jobProvider = await JobPoster.findById(providerId);

    if (!jobProvider) {
      return res.status(404).json({ message: "Job provider not found" });
    }

    // Get the total number of jobs created by the job provider
    const totalJobs = jobProvider.created_jobs.length;
    // console.log(totalJobs);

    // Calculate the total jobs created in the current month
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const totalJobsThisMonth = await Job.countDocuments({
      _id: { $in: jobProvider.created_jobs },
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Return the total jobs and the total jobs created in the current month
    res.status(200).json({ totalJobs, totalJobsThisMonth });
  } catch (error) {
    console.error("Error fetching total jobs and jobs this month:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchJobList = async (req, res) => {
  try {
    // Extract search parameters from the request body
    const { jobLocation, jobType, jobFormat, department } = req.body;

    if (
      !jobLocation ||
      !jobType ||
      !jobFormat ||
      !department ||
      !Array.isArray(jobLocation) ||
      !Array.isArray(jobType) ||
      !Array.isArray(jobFormat) ||
      !Array.isArray(department)
    ) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields as arrays." });
    }

    // Construct the query based on the provided search parameters
    let query = { paymentStatus: { $in: ["unpaid", "pending"] } };
    if (jobFormat && jobFormat.length > 0) {
      query.jobFormat = {
        $in: jobFormat.map((format) => new RegExp(format, "i")),
      };
    }
    if (jobLocation && jobLocation.length > 0) {
      query.jobLocation = {
        $in: jobLocation.map((location) => new RegExp(location, "i")),
      };
    }
    if (department && department.length > 0) {
      query.department = { $in: department.map((dep) => new RegExp(dep, "i")) };
    }
    if (jobType && jobType.length > 0) {
      query.jobType = { $in: jobType.map((type) => new RegExp(type, "i")) };
    }
    console.log("this is query", query);
    // Execute the query to find matching jobs
    const jobList = await Job.find(query)
      .populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      })
      .sort({ createdAt: -1 });

    // Check if any jobs match the criteria
    if (jobList.length === 0) {
      return res.status(404).json({ message: "No jobs match the criteria" });
    }

    // Return the list of matching jobs
    res.status(200).json({ jobs: jobList });
  } catch (error) {
    console.error("Error searching for jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getJobCreatedPerMonth = async (req, res) => {
  try {
    const jobsPerMonth = await Job.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          count: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const result = {};
    jobsPerMonth.forEach((item) => {
      result[months[item.month - 1]] = item.count;
    });
    res.json(result);
  } catch (error) {
    console.error("Error fetching job data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobCreatedByProviderPerMonth = async (req, res) => {
  const jobPosterId = req.params.jobPosterId;
  try {
    const jobPostings = await JobPoster.findOne({ jobPosterId: jobPosterId });
    const jobs = await Job.find({
      _id: {
        $in: jobPostings.created_jobs,
      },
    });

    // Group jobs by month
    const jobsPerMonth = jobs.reduce((acc, job) => {
      const date = new Date(job.createdAt);
      const monthName = date.toLocaleString("default", { month: "long" });
      acc[monthName] = (acc[monthName] || 0) + 1;
      return acc;
    }, {});

    // Create an array containing all month names
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(0, index);
      return date.toLocaleString("default", { month: "long" });
    });

    // Merge allMonths with jobsPerMonth
    const allMonthsData = allMonths.map((month) => ({
      month,
      data: jobsPerMonth[month] || 0, // Use 0 if no data exists for the month
    }));

    res.json(allMonthsData);
  } catch (error) {
    console.error("Error fetching job data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const totalJobsPerMonth = async (req, res) => {
  try {
    const jobs = await Job.find();

    const jobsPerMonth = jobs.reduce((acc, job) => {
      const jobDate = new Date(job.createdAt);
      const monthName = jobDate.toLocaleString("default", { month: "long" });
      acc[monthName] = (acc[monthName] || 0) + 1;
      return acc;
    }, {});

    // Create an array containing all month names
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(0, index);
      return date.toLocaleString("default", { month: "long" });
    });

    //console.log(allMonths);

    const allJobsPerMonths = allMonths.map((month) => ({
      month,
      totalJobs: jobsPerMonth[month] || 0,
    }));

    res.json(allJobsPerMonths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getJobByCategory = async (req, res) => {
  //Get department from query
  const department = req.query.department;
  console.log(department)
  if (!department) {
    return res.status(400).json({ message: "Please input department" });
  }
  try {
    const jobs = await Job.find({
      department: { $regex: new RegExp(department, "i") },
      status: "Pending"
    }).sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found under this department." });
    }
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error" });
  }
};
const saveJob = async (req, res) => {
  try {
    // Retrieve userId
    const userId = req.body.userId;
    // req.userId;
    const jobId = req.params.jobId;

    if (!userId || !jobId) {
      return res.status(404).json({ message: "userId & jobId is required." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    let savedJob = await SaveJob.findOne({ user: userId });

    if (!savedJob) {
      const newSaveJob = new SaveJob({
        user: userId,
        jobs: [jobId],
      });
      await newSaveJob.save();

      return res.status(200).json({ message: "Job saved successfully 1 ." });
    } else {
      // Check if job is not already saved
      if (!savedJob.jobs.includes(jobId)) {
        savedJob.jobs.push(jobId);
        await savedJob.save();

        return res.status(200).json({ message: "Job saved successfully." });
      } else {
        return res.status(200).json({ message: "Job already saved." });
      }
    }
  } catch (error) {
    console.error("Error in saveJob:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const getSavedJobs = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(404).json({ message: "userId is required." });
    }

    // Find saved jobs for the user and populate the 'jobs' field
    const savedJobs = await SaveJob.find({ user: userId })
      .populate({
        path: "jobs",
        populate: {
          path: "jobPoster", // Populate the 'jobPoster' field
          select: "companyName companyLogo", // Select the fields you want to include
        },
      })
      .sort({ createdAt: -1 });

    if (!savedJobs || savedJobs.length === 0) {
      return res.status(400).json({ message: "You have no saved jobs" });
    }
    console.log("this is save job", savedJobs);
    // Map savedJobs to include jobPoster's name and image

    res.status(200).json({ message: "Saved Jobs", savedJobs });
  } catch (error) {
    console.error("Error in getSavedJobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSavedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;
    // req.userId;
    const details = ["userId", "jobId"];

    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ message: `${detail} is required` });
      }
    }

    const savedJobs = await SaveJob.find({ user: userId });
    if (!savedJobs) {
      return res.status(400).json({ message: "You have no saved jobs" });
    }

    // Find and remove job
    for (const savedJob of savedJobs) {
      const index = savedJob.jobs.indexOf(jobId);
      if (index !== -1) {
        savedJob.jobs.splice(index, 1);
        await savedJob.save();
      }
    }

    res.status(200).json({ message: "Job removed successfully" });
  } catch (error) {
    console.error("Error in deleteSavedJob:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getLandingPageJobs,
  allJobsCategory,
  allJobs,
  getAJob,
  totalJobsPerMonth,
  totalJobsAndNewestJob,
  searchJobList,
  getJobCreatedPerMonth,
  getJobCreatedByProviderPerMonth,
  getJobByCategory,
  saveJob,
  getSavedJobs,
  deleteSavedJob,
};
