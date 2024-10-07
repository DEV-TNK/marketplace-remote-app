const { SeekerResume, Employment } = require("../../models/SeekerResume");
const User = require("../../models/Users");
const JobPosting = require("../../models/Job");
const Applicant = require("../../models/Applicant");
const Job = require("../../models/Job");
const Offer = require("../../models/Offer");
const sendOfferLetterEmail = require("../../utils/sendJobOfferLetter");
const sendRejectLetterEmail = require("../../utils/sendJobRejectLetter");
const sendSeekerAcceptanceEmail = require("../../utils/sendSeekerJobAcceptance.js");
const sendAcceptanceJobEmail = require("../../utils/sendAcceptJobOffer");
const sendSeekerRejectOfferEmail = require("../../utils/seekerRejectJobOffer");

const jobApplication = async (req, res) => {
  Applicant.sync();
  try {
    const { userId, jobId } = req.body;
    const details = ["userId", "jobId"];
    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ msg: `${detail} is required` });
      }
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const userDetails = await SeekerResume.findOne({
      where: { userId: userId },
    });
    if (!userDetails) {
      return res.status(404).json({ message: "User Resume does not exist" });
    }

    // Check if the user has already applied for the job
    const userApplications = await Applicant.findOne({
      where: { userId: userId, jobId: jobId },
    });
    if (userApplications) {
      return res
        .status(400)
        .json({ message: "You Have Previously Apply for this Job" });
    }

    // Create a new applicant record
    await Applicant.create({
      userId: userId, // Adjusted the field name to "userId"
      jobId: jobId,
    });

    // Increment the jobApplicants field in the Job schema
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $inc: { jobApplicants: 1 } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job application successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const myOfferLetter = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const offers = await Offer.findAll({
      where: { jobSeeker: userId, status: "pending" },
    });
    if (!offers || offers.length === 0) {
      return res.status(404).json({ message: "No offers found for this user" });
    }

    const offerDetails = [];
    for (const offer of offers) {
      const jobDetail = await Job.findOne({ _id: offer.jobId }).populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      });
      if (jobDetail) {
        const modifiedJobDetail = {
          ...jobDetail.toObject(),
          offerId: offer.id,
        };
        // Push the modified jobDetail object to offerDetails array
        offerDetails.push(modifiedJobDetail);
      }
    }
    return res.status(200).json({ offerDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const totalJobsApplied = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the database to count the number of distinct jobs applied for by the user
    const jobsAppliedCount = await Applicant.count({
      where: { userId },
    });

    res.status(200).json({ jobsAppliedCount });
  } catch (error) {
    console.error("Error fetching total jobs applied:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const acceptOrRejectOffer = async (req, res) => {
  try {
    const { offerId, status, userId } = req.body;
    const details = ["status", "offerId", "userId"];
    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ msg: `${detail} is required` });
      }
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const offerDetails = await Offer.findByPk(offerId);
    if (!offerDetails) {
      return res.status(404).json({ message: "No offers found for this id" });
    }

    // job offer search
    const jobDetails = await Job.findOneAndUpdate(
      { _id: offerDetails.jobId }, // Update the status field
      { new: true } // Return the updated document
    ).populate({
      path: "jobPoster",
      select: "companyName companyEmail",
    });
    if (!jobDetails) {
      return res.status(404).json({ message: "No Job found for this offer" });
    }
    console.log("this is job details", jobDetails);
    if (status === "true") {
      offerDetails.status = "accepted";
      jobDetails.paymentStatus = "pending";
      jobDetails.status = "Ongoing";
      await offerDetails.save();
      await jobDetails.save();
      await sendAcceptanceJobEmail({
        username: user.username,
        email: jobDetails.jobPoster.companyEmail,
        jobTitle: jobDetails.jobTitle,
        price: jobDetails.jobSalary,
        jobProvider: jobDetails.jobPoster.companyName,
        description: jobDetails.jobDescription,
        deliveryDate: jobDetails.deliveryDate,
        type: jobDetails.jobType,
      });
      await sendSeekerAcceptanceEmail({
        username: user.username,
        email: user.email,
        jobTitle: jobDetails.jobTitle,
      });

      return res.status(200).json({
        message: "Offer Accepted Successfully",
        offerDetails,
        jobDetails,
      });
    } else {
      offerDetails.status = "rejected";
      await offerDetails.save();

      await sendSeekerRejectOfferEmail({
        username: user.username,
        email: jobDetails.jobPoster.companyEmail,
        jobTitle: jobDetails.jobTitle,
        price: jobDetails.jobSalary,
        jobProvider: jobDetails.jobPoster.companyName,
        description: jobDetails.jobDescription,
        deliveryDate: jobDetails.deliveryDate,
        type: jobDetails.jobType,
      });
      return res.status(200).json({
        message: "Offer Rejected Successfully",
        offerDetails,
        jobDetails,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getApplicationsBySeeker = async (req, res) => {
  try {
    const { userId } = req.params;

    // Query applications made by the specified seeker
    const applications = await Applicant.findAll({
      where: { userId: userId },
    });

    // Group applications by month name
    const applicationsPerMonth = applications.reduce((acc, application) => {
      const applicationDate = new Date(application.createdAt);
      const monthName = applicationDate.toLocaleString("default", {
        month: "long",
      }); // Get full month name
      acc[monthName] = (acc[monthName] || 0) + 1; // Increment count for the month
      return acc;
    }, {});

    // Create an array containing all month names
    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(0, index);
      return date.toLocaleString("default", { month: "long" });
    });

    // Merge allMonths with applicationsPerMonth
    const allMonthsData = allMonths.map((month) => ({
      month,
      data: applicationsPerMonth[month] || 0, // Use 0 if no data exists for the month
    }));

    res.json(allMonthsData);
  } catch (error) {
    console.error("Error Message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// const getSeekerJobOffersReceived = async (req, res) => {
//   const userId = req.params.userId
//   try {
//     const joboffers = Offer.findAll({
//       where: { jobSeeker: userId }
//     })
//     res.json(joboffers)
//   } catch (error) {
//     console.error("Error fetching seeker offers received:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

const userPendingApplications = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const pendingApplications = await Applicant.findAll({
      where: { userId, status: "pending" },
    });

    if (!pendingApplications || pendingApplications.length === 0) {
      return res
        .status(404)
        .json({ message: "No pending job applications found for this user." });
    }

    const jobIds = pendingApplications.map((app) => app.jobId);

    const jobs = await JobPosting.find({
      _id: { $in: jobIds },
    }).populate({
      path: "jobPoster",
      select: "companyName companyLogo",
    });

    res.status(200).json({ pendingApplications, jobs });
  } catch (error) {
    console.error("Error fetching pending job applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  jobApplication,
  totalJobsApplied,
  myOfferLetter,
  acceptOrRejectOffer,
  getApplicationsBySeeker,
  userPendingApplications,
};
