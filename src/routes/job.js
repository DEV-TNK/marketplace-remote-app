const express = require("express");
const jobController = require("../controllers/JobController/job");
const getTopCompaniesHiring = require("../controllers/ProviderController/TopCompanies");
const {
  submitReview,
  getAllReviews,
  getReviewsByProvider,
  getReviewsBySeeker,
  editReview,
} = require("../controllers/JobController/RatingController");

const router = express.Router();

router.post("/post-job", jobController.createJob);
router.get("/all-jobs", jobController.getAllJobs);
router.get("/get-Landing-jobs", jobController.getLandingPageJobs);
router.get("/jobs-created-per-month", jobController.getJobCreatedPerMonth);
router.get(
  "/jobs-created-by-provider/:jobPosterId",
  jobController.getJobCreatedByProviderPerMonth
);

router.get("/all-jobs-category", jobController.allJobsCategory);
router.get("/jobs", jobController.allJobs);
router.get("/get-a-job/:jobId", jobController.getAJob);

//featuredCompanies routes
router.get("/top-companies", getTopCompaniesHiring);

//routes for review submission
router.post("/submit-reviews", submitReview);
router.get("/reviews", getAllReviews);
router.put("/editReview", editReview);
router.get("/get-company-reviews/:userId", getReviewsByProvider);
router.get("/get-seeker-reviews/:userId", getReviewsBySeeker);

//routes for totalJobsandNewest
router.get("/jobposter/:providerId", jobController.totalJobsAndNewestJob);

// routes to serach for a jobs
router.post("/seeker-serch-job", jobController.searchJobList);
router.get("/jobs-by-department", jobController.getJobByCategory);

//routes for saving and saved jobs
router.post("/save-job/:jobId", jobController.saveJob);
router.get("/get-my-saved-jobs/:userId", jobController.getSavedJobs);
router.delete("/delete-save-job", jobController.deleteSavedJob);

//total job created per month
router.get("/jobs-per-month", jobController.totalJobsPerMonth);

//routes for totalCompaniesAndJobs
// router.get("/total-companies-and-jobs", jobController.totalCompaniesAndJobs);

module.exports = router;
