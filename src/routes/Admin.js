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

const {
  getAllOutSource,
  allCompletedJobs,
  allPendingJobs,
  allUnpaidJobs,
  markOutSourcJobCompleted,
  getAlleEmployeeOfRecordJobs,
} = require("../controllers/AdminController/OutSource");

//Routes to get all job posters and all jobseekers
router.get("/get-job-posters", getAllJobPoster);
router.get("/get-job-seekers", getAllJobSeekersInfo);

router.get("/admin-overview", overview);
router.get("/admin-overview-last-four-jobs", last4JobsCreated);
router.get("/admin-overview-most-popular", mostPopular);
router.get("/admin-jobCategory", jobCategory);
router.get("/admin-categorySingle/:category", categorySingle);
router.get("/admin-jobs-ongoing", OngoingJobs);
router.get("/admin-jobs-completed", CompletedJobs);
router.get("/admin-overview-total-jobs-by-department", totalJobsByDepartment);
router.get("/admin-overview-job-status", jobStatus);
router.get("/admin-all-job", adminAllJobs);
router.get("/admin-all-pending-payment", seekerPendingPayment);
router.post("/admin-acceptorreject-payment", acceptOrRejectPayment);
router.post("/admin-mark-payment-request", markWithdrawalRequest);
router.get("/admin-all-outSource-jobs", getAllOutSource);
router.get("/admin-all-employee-of-records-jobs", getAlleEmployeeOfRecordJobs);
router.get("/admin-all-unpaid-outsource-jobs", allUnpaidJobs);
router.get("/admin-all-pending-outsource-jobs", allPendingJobs);
router.get("/admin-all-completed-outsource-jobs", allCompletedJobs);
router.put("/admin-mark-outsource-job/:jobId", markOutSourcJobCompleted);

module.exports = router;
