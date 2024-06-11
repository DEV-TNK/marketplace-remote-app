const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/userImages");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const imageUpload = multer({ storage: imageStorage });
router.post(
  "/provider-logo-update",
  imageUpload.single("userimage"),
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

// Set up multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "../uploads");
    if (file.fieldname === "userImage") {
      uploadPath = path.join(uploadPath, "userImages");
    } else if (file.fieldname === "portfolioImages") {
      uploadPath = path.join(uploadPath, "portfolioImages");
    } else if (file.fieldname === "certificationImage") {
      uploadPath = path.join(uploadPath, "certificationImages");
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileUpload = multer({ fileStorage });

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
