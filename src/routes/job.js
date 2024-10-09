const express = require("express");
const jobController = require("../controllers/JobController/job");
const getTopCompaniesHiring = require("../controllers/ProviderController/TopCompanies");
const {
  submitReview,
  getAllReviews,
  getReviewsByProvider,
  getReviewsBySeeker,
  editReview,
  reviewService,
  getReviewsByService,
} = require("../controllers/JobController/RatingController");

const {
  saveService,
  getSavedServices,
} = require("../controllers/ServiceSeekerController/serviceSeeker");
const authenticatedUser = require("../middleware/authentication")

const router = express.Router();

router.post("/post-job", jobController.createJob);
router.get("/all-jobs", jobController.getAllJobs);
router.get("/get-Landing-jobs", jobController.getLandingPageJobs);
router.get("/jobs-created-per-month", jobController.getJobCreatedPerMonth);
router.get(
  "/jobs-created-by-provider/:jobPosterId", authenticatedUser,
  jobController.getJobCreatedByProviderPerMonth
);

router.get("/all-jobs-category", jobController.allJobsCategory);
router.get("/jobs", jobController.allJobs);
router.get("/get-a-job/:jobId", jobController.getAJob);

//featuredCompanies routes
router.get("/top-companies", getTopCompaniesHiring);

//routes for review submission
router.post("/submit-reviews", authenticatedUser, submitReview);
router.get("/reviews", getAllReviews); //,
router.put("/editReview", authenticatedUser, editReview);
router.get("/get-company-reviews/:userId", authenticatedUser, getReviewsByProvider);
router.get("/get-seeker-reviews/:userId", authenticatedUser, getReviewsBySeeker);
router.post("/review-service", authenticatedUser, reviewService);
router.get("/review-by-service/:serviceId", getReviewsByService);
//routes for totalJobsandNewest
router.get("/jobposter/:jobPosterId", jobController.totalJobsAndNewestJob);

// routes to serach for a jobs
router.post("/seeker-serch-job", jobController.searchJobList);
router.get("/jobs-by-department", jobController.getJobByCategory);

//routes for saving and saved jobs
router.post("/save-job/:jobId", jobController.saveJob);
router.get("/get-my-saved-jobs/:userId", jobController.getSavedJobs);
router.delete("/delete-save-job", jobController.deleteSavedJob);
router.post("/save-service/:serviceId", saveService);
router.get("/get-my-saved-services/:userId", getSavedServices);

//total job created per month
router.get("/jobs-per-month", jobController.totalJobsPerMonth);

//routes for totalCompaniesAndJobs
// router.get("/total-companies-and-jobs", jobController.totalCompaniesAndJobs);

module.exports = router;
