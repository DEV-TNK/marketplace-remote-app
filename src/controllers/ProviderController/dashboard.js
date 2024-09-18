const JobPoster = require("../../models/JobPoster");
const User = require("../../models/Users");
const cloudinary = require("cloudinary").v2;
const ProviderTransaction = require("../../models/ProviderTransaction");
const Job = require("../../models/Job");
//const OutSourceJob = require("../../models/OutSource")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const uploadProviderImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: `User ID is required` });
    }
    // Retrieve user's interests from MySQL
    let user = await User.findByPk(userId);
    let jobPoster = await JobPoster.findOne({ jobPosterId: userId });
    if (!user) {
      return res.status(400).json({ message: `User Does not exist` });
    }
    if (!jobPoster) {
      return res.status(400).json({ message: `Job Poster Does not exist` });
    }
    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });

    const imageLink = imageUpload.secure_url;
    user.imageUrl = imageLink;
    jobPoster.companyLogo = imageLink;

    await user.save();
    await jobPoster.save();
    res
      .status(200)
      .json({ message: "Image Uploaded Successfully", user, jobPoster });
  } catch (error) {
    console.error("EError uploading:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMydashboard = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: `User ID is required` });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }

    // Calculate total amount spent
    const transactions = await ProviderTransaction.findAll({
      where: {
        userId: userId,
        status: "success",
      },
    });
    let totalAmountSpent = {
      NGN: 0,
      GBP: 0,
      EUR: 0,
      USD: 0,
    };
    transactions.forEach((transaction) => {
      totalAmountSpent[transaction.currency] += parseFloat(transaction.amount);
    });


    // Find provider
    const provider = await JobPoster.findOne({ jobPosterId: userId });
    if (!provider) {
      return res.status(404).json({ message: `Job provider not found` });
    }

    // Calculate total job postings for the month
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentMonth - 1,
      1
    );
    const endOfMonth = new Date(currentDate.getFullYear(), currentMonth, 0);
    const totalJobPosting = provider.created_jobs.length;

    // Find completed jobs for the month
    const monthLyJobs = await Job.countDocuments({
      jobPoster: provider._id,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const completedJobs = await Job.countDocuments({
      jobPoster: provider._id,
      status: "Completed",
    });

    // Find pending jobs for the month
    const pendingJobs = await Job.countDocuments({
      jobPoster: provider._id,
      status: "Pending",
    });

    const ongoingJobs = await Job.countDocuments({
      jobPoster: provider._id,
      status: "Ongoing",
    });

    res.status(200).json({
      totalAmountSpent: totalAmountSpent,
      totalJobPosting: totalJobPosting,
      completedJobs: completedJobs,
      pendingJobs: pendingJobs,
      monthLyJobs: monthLyJobs,
      ongoingJobs: ongoingJobs,
    });
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getlastFourPaidJobs = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!userId) {
//       return res.status(400).json({ message: `User ID is required` });
//     }
//     // Retrieve the last four successful transactions for the user
//     const transactions = await ProviderTransaction.findAll({
//       where: {
//         userId: userId,
//         status: "success",
//       },
//       order: [["createdAt", "DESC"]],
//       limit: 4,
//     });
//     console.log("this is transactions", transactions);

//     // Get the job IDs from the transactions
//     const jobIds = transactions.map((transaction) => transaction.jobId);
//     console.log("this is jobs", jobIds);

//     // Remove commas, dots, and leading zeros from the transaction amounts
//     const sanitizedTransactionAmounts = transactions.map((transaction) =>
//       parseFloat(
//         transaction.amount
//           .toString()
//           .replace(/,/g, "")
//           .replace(/\.[0-9]*0+$/, "")
//           .replace(/[,.]$/, "")
//       )
//     );
//     console.log(
//       "this is sanitizedTransactionAmounts",
//       sanitizedTransactionAmounts
//     );

//     // Retrieve the job details for the last four paid jobs

//     const lastFourPaidJobs = await Job.find({
//       _id: { $in: jobIds },
//     }).sort({ createdAt: -1 });

//     // Sanitize jobSalary values stored in MongoDB and compare them with transaction amounts
//     const matchingJobs = [];
//     lastFourPaidJobs.forEach((job) => {
//       console.log("this is jobs", job);
//       const sanitizedJobSalary = parseFloat(
//         job.jobSalary
//           .toString()
//           .replace(/,/g, "")
//           .replace(/\.[0-9]*0+$/, "")
//           .replace(/[,.]$/, "")
//       );
//       console.log("this is sanitizedJobSalary", sanitizedJobSalary);
//       if (sanitizedTransactionAmounts.includes(sanitizedJobSalary)) {
//         matchingJobs.push(job);
//       }
//     });

//     res.status(200).json({ matchingJobs });
//   } catch (error) {
//     console.error("Error getting last four paid jobs:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


const getlastFourPaidJobs = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: `User ID is required` });
    }

    // Retrieve the last four successful transactions for the user
    const transactions = await ProviderTransaction.findAll({
      where: {
        userId: userId,
        status: "success",
      },
      order: [["createdAt", "DESC"]],
      limit: 4,
    });
    console.log("this is transactions", transactions);

    // Get the job IDs from the transactions
    const jobIds = transactions.map((transaction) => transaction.jobId);
    console.log("this is jobs", jobIds);

    // Sanitize transaction amounts
    const sanitizedTransactionAmounts = transactions.map((transaction) =>
      parseFloat(
        transaction.amount
          .toString()
          .replace(/,/g, "")
          .replace(/\.[0-9]*0+$/, "")
          .replace(/[,.]$/, "")
      )
    );
    console.log(
      "this is sanitizedTransactionAmounts",
      sanitizedTransactionAmounts
    );

    // Retrieve the job details from both Job and OutSourceJob models
    const jobsFromJobModel = await Job.find({
      _id: { $in: jobIds },
    }).sort({ createdAt: -1 });

    const jobsFromOutSourceJobModel = await OutSourceJob.find({
      _id: { $in: jobIds },
    }).sort({ createdAt: -1 });

    // Combine the results from both models
    const allJobs = [...jobsFromJobModel, ...jobsFromOutSourceJobModel];

    // Sort combined results by createdAt and limit to the last 4
    const sortedJobs = allJobs.sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

    // Sanitize jobSalary values stored in MongoDB and compare them with transaction amounts
    // const matchingJobs = sortedJobs.filter((job) => {
    //   const sanitizedJobSalary = parseFloat(
    //     job.jobSalary
    //       // .toString()
    //       .replace(/,/g, "")
    //       .replace(/\.[0-9]*0+$/, "")
    //       .replace(/[,.]$/, "")
    //   );
    //   return sanitizedTransactionAmounts.includes(sanitizedJobSalary);
    // });

    // Format the response
    const formattedJobs = sortedJobs.map((job) => {
      if (job.jobs) {
        // If it's an OutSourceJob, consolidate the job titles and prices
        const jobTitles = job.jobs.map((j) => j.title);
        const totalJobPrice = job.jobs.reduce((sum, j) => sum + parseFloat(j.price), 0);
        const currency = job.jobs[0]?.currency || "";
        const number = job.jobs.reduce((sum, j) => sum + parseFloat(j.numberOfPerson), 0);
        return {
          _id: job._id,
          jobTitles: jobTitles,
          totalPrice: totalJobPrice,
          status: job.status,
          type: "Out-Source",
          currency: currency,
          number: number
        };
      } else {
        // If it's a regular Job, format as needed
        return {
          _id: job._id,
          jobTitles: [job.jobTitle],
          jobSalary: parseInt(job.jobSalary),
          status: job.status,
          type: "Single Job",
          currency: job.currency,
          number: 1
        };
      }
    });

    res.status(200).json({ jobs: formattedJobs });
  } catch (error) {
    console.error("Error getting last four paid jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { uploadProviderImage, getMydashboard, getlastFourPaidJobs };
