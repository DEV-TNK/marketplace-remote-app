// const OutSourceJobs = require("../../models/OutSource");
// const outSourceJobs = require("../../models/OutSource");

// const getAllOutSource = async (req, res) => {
//   const status = req.query.status;
//   const paymentStatus = req.query.paymentStatus;
//   try {
//     let body = {
//       JobType: "Out-Sourcing",
//       ...(status && { status }),
//       ...(paymentStatus && { paymentStatus }),
//     };

//     const jobs = await outSourceJobs
//       .find(body)
//       .populate({
//         path: "jobPoster",
//         select: "companyName companyLogo companyEmail companyContact",
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({ jobs });
//   } catch (error) {
//     console.error("Error retrieving providers with most jobs:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const markOutSourcJobCompleted = async (req, res) => {
//   const jobId = req.params.jobId;

//   try {
//     const job = await OutSourceJobs.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ message: "Outsourced job not found" });
//     }

//     if (job.paymentStatus !== "paid") {
//       return res
//         .status(400)
//         .json({ message: "Job payment is still outstanding" });
//     }

//     const completedOutSourcedJob = await OutSourceJobs.findByIdAndUpdate(
//       jobId,
//       { status: "completed" },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Job marked as completed",
//       job: completedOutSourcedJob,
//     });
//   } catch (error) {
//     console.error("Error marking job as completed:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getAlleEmployeeOfRecordJobs = async (req, res) => {
//   const status = req.query.status;
//   const paymentStatus = req.query.paymentStatus;
//   try {
//     let body = {
//       JobType: "Employee of Record",
//       ...(status && { status }),
//       ...(paymentStatus && { paymentStatus }),
//     };

//     const jobs = await outSourceJobs
//       .find(body)
//       .populate({
//         path: "jobPoster",
//         select: "companyName companyLogo companyEmail companyContact",
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({ jobs });
//   } catch (error) {
//     console.error("Error retrieving providers with most jobs:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const allPendingJobs = async (req, res) => {
//   try {
//     const pendingJobs = await OutSourceJobs.find({
//       status: "pending",
//     })
//       .populate({
//         path: "jobPoster",
//         select: "companyName companyLogo companyEmail companyContact",
//       })
//       .sort({ createdAt: -1 });
//     res.status(200).json({ pendingJobs });
//   } catch (error) {
//     console.error("error retrieving pending jobs:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const allCompletedJobs = async (req, res) => {
//   try {
//     const completedJobs = await OutSourceJobs.find({
//       status: "completed",
//     })
//       .populate({
//         path: "jobPoster",
//         select: "companyName companyLogo companyEmail companyContact",
//       })
//       .sort({ createdAt: -1 });
//     res.status(200).json({ completedJobs });
//   } catch (error) {
//     console.error("error retrieving completed jobs:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const allUnpaidJobs = async (req, res) => {
//   try {
//     const unpaidJobs = await OutSourceJobs.find({
//       paymentStatus: "unpaid",
//     })
//       .populate({
//         path: "jobPoster",
//         select: "companyName companyLogo companyEmail companyContact",
//       })
//       .sort({ createdAt: -1 });
//     res.status(200).json({ unpaidJobs });
//   } catch (error) {
//     console.error("error retrieving unpaid jobs:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// module.exports = {
//   getAllOutSource,
//   allPendingJobs,
//   allCompletedJobs,
//   allUnpaidJobs,
//   markOutSourcJobCompleted,
//   getAlleEmployeeOfRecordJobs,
// };
