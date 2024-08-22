const express = require("express");
const router = express.Router();
const {
  imageUpload,
  upload,
  fileUpload,
  providerStorage,
} = require("../helper/multerUpload");
const multer = require("multer");

const providerUpload = multer({
  storage: providerStorage,
  limits: {
    fileSize: 104857600, // 100MB
  },
});

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
  uploadProviderImage,
  getMydashboard,
  getlastFourPaidJobs,
} = require("../controllers/ProviderController/dashboard");
const {
  onboardingServiceProvider,
} = require("../controllers/ProviderController/serviceProvider");

router.post(
  "/provider-logo-update",
  imageUpload.single("userimage"),
  uploadProviderImage
);

router.post(
  "/create-provider",
  providerUpload.single("companyLogo"),
  createProvider
);
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

router.post(
  "/onboard-service-provider",
  fileUpload.fields([
    { name: "userImage", maxCount: 1 },
    { name: "portfolioImages", maxCount: 10 },
    { name: "certificationImage", maxCount: 1 },
  ]),
  onboardingServiceProvider
);
module.exports = router;
