const Job = require("../../models/Job");
const JobPoster = require("../../models/JobPoster");
const Users = require("../../models/Users");
const Service = require("../../models/Service")
const { Op } = require("sequelize");

const overview = async (req, res) => {
  try {
    // Get overview data
    const currentDate = new Date();
    //console.log("this is current date", currentDate);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    //console.log("Start of Month:", startOfMonth);
    //console.log("End of Month:", endOfMonth);


    const monthlySeeker = await Users.findAll({
      where: {
        role: "seeker",
        createdAt: { [Op.gte]: startOfMonth, [Op.lte]: endOfMonth },
      },
    });

    const totalSeeker = await Users.count({
      where: {
        role: "seeker",
      },
    });

    const monthlyProvider = await Users.findAll({
      where: {
        role: "provider",
        createdAt: { [Op.gte]: startOfMonth, [Op.lte]: endOfMonth },
      },
    });
    const totalProvider = await Users.count({
      where: {
        role: "provider",
      },
    });

    const monthlyJob = await Job.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    }).exec();

    const totalJob = await Job.countDocuments()

    const monthlyService = await Service.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    }).exec()
    const totalService = await Service.countDocuments()


    const dashboardData = {
      monthlySeeker: monthlySeeker.length,
      totalSeeker: totalSeeker,
      monthlyProvider: monthlyProvider.length,
      totalProvider: totalProvider,
      monthlyJob: monthlyJob.length,
      totalJob: totalJob,
      monthlyService: monthlyService.length,
      totalService: totalService,

    };
    res.status(200).json({ dashboardData });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const last4JobsCreated = async (req, res) => {
  try {
    const lastFourJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("jobPoster", "companyName companyLogo");
    res.status(201).json({ lastFourJobs });
  } catch (error) {
    console.error("Error fetching last four jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const mostPopular = async (req, res) => {
  try {
    const providersWithJobs = await Job.aggregate([
      {
        $group: {
          _id: "$jobPoster",
          totalJobs: { $sum: 1 },
        },
      },
      {
        $sort: { totalJobs: -1 },
      },
      {
        $limit: 4, // Limit the result to only the top 4 providers
      },
    ]);

    if (providersWithJobs.length === 0) {
      return res.status(404).json({ message: "No providers found" });
    }

    const providers = [];

    for (const provider of providersWithJobs) {
      const providerId = provider._id;
      const totalJobs = provider.totalJobs;
      const providerDetails = await JobPoster.findById(providerId);

      if (providerDetails) {
        providers.push({
          providerId: providerDetails._id,
          companyName: providerDetails.companyName,
          companyLogo: providerDetails.companyLogo,
          totalJobs,
        });
      }
    }
    // Return the list of providers with the most jobs
    res.status(200).json({ providers });
  } catch (error) {
    console.error("Error retrieving providers with most jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const totalJobsByDepartment = async (req, res) => {
  try {
    const totalJobsByDepartment = await Job.aggregate([
      {
        $group: {
          _id: "$department",
          totalJobs: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ totalJobsByDepartment });
  } catch (error) {
    console.error("Error retrieving total jobs by department:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const jobStatus = async (req, res) => {
  try {
    // Find all jobs
    const allJobs = await Job.find();

    // Find pending jobs
    const pendingJobs = await Job.find({ status: "Pending" });

    // Find completed jobs
    const completedJobs = await Job.find({ status: "Completed" });

    // Find ongoing jobs
    const ongoingJobs = await Job.find({ status: "Ongoing" });
    console.log(ongoingJobs, pendingJobs, completedJobs);
    // Return all jobs, pending jobs, completed jobs, and ongoing jobs separately
    res.status(200).json({
      allJobs,
      pendingJobs,
      completedJobs,
      ongoingJobs,
    });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  overview,
  last4JobsCreated,
  mostPopular,
  totalJobsByDepartment,
  jobStatus,
};
