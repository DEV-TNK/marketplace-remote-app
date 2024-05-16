const Job = require("../../models/Job")


const jobCategory = async (req, res) => {
    try {
         const mostPopularCategories = await Job.aggregate([
  {
    $group: {
      _id: "$department",
      totalJobs: { $sum: 1 },
      totalSalary: { $sum: { $convert: { input: { $replaceAll: { input: "$jobSalary", find: ",", replacement: "" } }, to: "double" } } },
      averageSalary: {
        $avg: {
          $convert: {
            input: { $replaceAll: { input: "$jobSalary", find: ",", replacement: "" } },
            to: "double"
          }
        }
      },
      PendingJobs: {
        $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
      },
      OngoingJobs: {
        $sum: { $cond: [{ $eq: ["$status", "Ongoing"] }, 1, 0] }
      },
      completedJobs: {
        $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
      }
    }
  },
  { $sort: { totalJobs: -1 } }
  // { $limit: 4 }
]);
        return res.status(200).json({ mostPopularCategories });
    } catch (error) {
        console.error("Error retrieving providers with most jobs:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const categorySingle = async (req, res) => {
    try {
        const category = req.params.category;
        if(!category){
            return res.status(404).json({ message: 'no category provided' });
        }

        // Find all courses in the specified category
        const categorySingle = await Job.find({ department: category }).populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      });
        if (!categorySingle || categorySingle.categorySingle === 0) {
            return res.status(404).json({ message: 'No Job found for the specified category' });
        }
        return res.status(200).json({ categorySingle });
    } catch (error) {
         console.error("Error retrieving providers with most jobs:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const OngoingJobs = async (req, res) => {
    try {

        // Find all courses in the specified category
        const Ongoing = await Job.find({  status: "Ongoing" }).populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      }).sort({ createdAt: -1});
        if (!Ongoing || Ongoing.length === 0) {
            return res.status(404).json({ message: 'No Job found for the specified part' });
        }
        return res.status(200).json({ Ongoing });
    } catch (error) {
         console.error("Error retrieving providers with most jobs:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
} 

const CompletedJobs = async (req, res) => {
    try {
        // Find all courses in the specified category
        const completed = await Job.find({  status: "Completed" }).populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      }).sort({ createdAt: -1});
        if (!completed || completed.length === 0) {
            return res.status(404).json({ message: 'No Job found for the specified part' });
        }
        return res.status(200).json({ completed });
    } catch (error) {
         console.error("Error retrieving providers with most jobs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
} 

const adminAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      })
      .sort({ createdAt: -1});
      

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {jobCategory, categorySingle, OngoingJobs, CompletedJobs, adminAllJobs} 