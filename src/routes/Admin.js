const express = require("express");
const router = express.Router();
const {
  getAllJobPoster,
  getAllJobSeekersInfo,
} = require("../controllers/AdminController/Dashboard");

const {
  overview,
  last4JobsCreated,
  mostPopular,
  totalJobsByDepartment,
  jobStatus,
} = require("../controllers/AdminController/Overview");
const {
  jobCategory,
  categorySingle,
  OngoingJobs,
  CompletedJobs,
  adminAllJobs,
} = require("../controllers/AdminController/Job");
const {
  seekerPendingPayment,
  acceptOrRejectPayment,
  markWithdrawalRequest,
} = require("../controllers/AdminController/Payment");
const verifyAdmin = require("../middleware/authenticatedAdmin");

// const {
//   getAllOutSource,
//   allCompletedJobs,
//   allPendingJobs,
//   allUnpaidJobs,
//   markOutSourcJobCompleted,
//   getAllEmployeeOfRecordJobs,
// } = require("../controllers/AdminController/OutSource");

//const getAdminEmployeeOfRecordJobs = require("../controllers/AdminController/EmployeeOfRecord")

//Routes to get all job posters and all jobseekers
router.get("/get-job-posters", verifyAdmin, getAllJobPoster);
router.get("/get-job-seekers", verifyAdmin, getAllJobSeekersInfo);

router.get("/admin-overview", verifyAdmin, overview);
router.get("/admin-overview-last-four-jobs", verifyAdmin, last4JobsCreated);
router.get("/admin-overview-most-popular", verifyAdmin, mostPopular);
router.get("/admin-jobCategory", verifyAdmin, jobCategory);
router.get("/admin-categorySingle/:category", verifyAdmin, categorySingle);
router.get("/admin-jobs-ongoing", verifyAdmin, OngoingJobs);
router.get("/admin-jobs-completed", verifyAdmin, CompletedJobs);
router.get("/admin-overview-total-jobs-by-department", verifyAdmin, totalJobsByDepartment);
router.get("/admin-overview-job-status", verifyAdmin, jobStatus);
router.get("/admin-all-job", verifyAdmin, adminAllJobs);
router.get("/admin-all-pending-payment", verifyAdmin, seekerPendingPayment);
router.post("/admin-acceptorreject-payment", verifyAdmin, acceptOrRejectPayment);
router.post("/admin-mark-payment-request", verifyAdmin, markWithdrawalRequest);
//router.get("/admin-all-outSource-jobs", getAllOutSource);
// router.get("/admin-all-employee-of-records-jobs", getAllEmployeeOfRecordJobs);
// router.get("/admin-all-unpaid-outsource-jobs", allUnpaidJobs);
// router.get("/admin-all-pending-outsource-jobs", allPendingJobs);
// router.get("/admin-all-completed-outsource-jobs", allCompletedJobs);
// router.put("/admin-mark-outsource-job/:jobId", markOutSourcJobCompleted);

//router.get("/admin-employee-of-record", getAdminEmployeeOfRecordJobs)

module.exports = router;
