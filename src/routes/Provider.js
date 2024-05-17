const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProvider,
  getCompanyAboutUs,
  getAllJobsPostedByCompany,
  companyDetails,
  searchCompanyList,
  companySingle,
  getProviderProfile,
  allCompaniesByJobs,
} = require("../controllers/ProviderController/CreateProvider");
const {
  myJobApplication,
  sendOffer,
} = require("../controllers/ProviderController/ApplicantsProfile");
const { route } = require("./Seeker");
const {
  getMyJobs,
  makeJobCompleted,
} = require("../controllers/ProviderController/MyJobs");

const {
  createOutSourceJobs,
  getMyOutSourceJob,
  getAOutSourceJob,
  deleteOutSourceJob,
} = require("../controllers/ProviderController/OutSource");

const {
  uploadProviderImage,
  getMydashboard,
  getlastFourPaidJobs,
} = require("../controllers/ProviderController/dashboard");

// Set up multer for handling multipart/form-data
const storage = multer.diskStorage({});
const upload = multer({ storage });
const storageSeeker = multer.diskStorage({});
const uploadSeeker = multer({ storage: storageSeeker });

router.post(
  "/provider-logo-update",
  uploadSeeker.single("image"),
  uploadProviderImage
);

router.post("/create-provider", upload.single("companyLogo"), createProvider);
router.get("/get-provider-profile/:userId", getProviderProfile);
router.get("/get-my-applicants/:userId", myJobApplication);
router.post("/send-offer", sendOffer);
router.get("/get-provider-jobs/:userId", getMyJobs);
router.get("/get-provider-dashboardJobs/:userId", getMydashboard);
router.get("/get-provider-dashboardPaidJobs/:userId", getlastFourPaidJobs);

router.get("/companySingle-about-us/:jobPosterId", getCompanyAboutUs);
router.get("/companySingle-all-jobs/:jobPosterId", getAllJobsPostedByCompany);

// get the company details and search for company
router.get("/companies", companyDetails);
router.get("/company-single/:companyId", companySingle);

router.post("/companies/company-list", searchCompanyList);
router.post("/mark-job-completed", makeJobCompleted);

// outsource jobs
router.post("/create-outsource-jobs", createOutSourceJobs);
router.get("/get-my-outsource-job/:userId", getMyOutSourceJob);
router.get("/get-single-outsource-job/:jobId", getAOutSourceJob);
router.delete("/delete-outsource-job", deleteOutSourceJob);

module.exports = router;
