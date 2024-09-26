const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs")
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

// const {
//   createOutSourceJobs,
//   getMyOutSourceJob,
//   getAOutSourceJob,
//   deleteOutSourceJob,
//   totalOutSourceJobsPerMonth,
// } = require("../controllers/ProviderController/OutSource");

const {
  uploadProviderImage,
  getMydashboard,
  getlastFourPaidJobs,
} = require("../controllers/ProviderController/dashboard");
//const getProviderEmployeeOfRecordJobs = require("../controllers/ProviderController/ProviderEmployeeOfRecord");
const {
  onboardingServiceProvider,
  providerCreateService,
  completeService,
  getServiceRequests,
  serviceProviderDashboard,
  myGigs,
  getlastFourPaidGigs,
  getPortfolioImage,
  getCertificateImage,
  getMyServices,
  editService,
  deleteService,
  getGigsEmployed,
  getOngoingEmployedGigs,
  getCompletedEmployedGigs,
  getServicesCreatedPerMonth,
  //createServiceRequest,
  //getOrderSummary
} = require("../controllers/SeekerController/Service");



// Set up multer for handling multipart/form-data
const storage = multer.diskStorage({});
const upload = multer({ storage });
const storageSeeker = multer.diskStorage({});
const uploadSeeker = multer({ storage: storageSeeker });
const authenticatedUser = require("../middleware/authentication");

const onboardingUpload = multer({ storage });

const organizeFiles = (req, res, next) => {
  req.certifications = [];
  req.portfolios = {};

  console.log('Files received:', req.files);

  req.files.forEach(file => {
    if (file.fieldname.startsWith('portfolio')) {
      const match = file.fieldname.match(/portfolio\[(\d+)\]\[images\]/);
      if (match) {
        const index = match[1];
        if (!req.portfolios[index]) {
          req.portfolios[index] = { images: [] };
        }
        req.portfolios[index].images.push(path.join('uploads/images/service-portfolio', file.filename));
      }
    } else if (file.fieldname.startsWith('certification')) {
      const match = file.fieldname.match(/certification\[(\d+)\]\[image\]/);
      if (match) {
        const index = match[1];
        req.certifications.push({
          index,
          name: file.originalname,
          image: path.join('uploads/images/service-certificates', file.filename),
        });
      }
    }
  });

  console.log('Certifications:', req.certifications);
  console.log('Portfolios:', req.portfolios);

  next();
};

const backgroundStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join('uploads/images/service-background');

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const backgroundUpload = multer({ storage: backgroundStorage });

router.post("/provider-logo-update", uploadSeeker.single("image"), uploadProviderImage);

router.post("/create-provider", upload.single("companyLogo"), createProvider);
router.get("/get-provider-profile/:userId", authenticatedUser, getProviderProfile);
router.get("/get-my-applicants/:userId", authenticatedUser, myJobApplication);
router.post("/send-offer", authenticatedUser, sendOffer);
router.get("/get-provider-jobs/:userId", authenticatedUser, getMyJobs);
router.get("/get-provider-dashboardJobs/:userId", authenticatedUser, getMydashboard);
router.get("/get-provider-dashboardPaidJobs/:userId", authenticatedUser, getlastFourPaidJobs);

router.get("/companySingle-about-us/:jobPosterId", authenticatedUser, getCompanyAboutUs);
router.get("/companySingle-all-jobs/:jobPosterId", authenticatedUser, getAllJobsPostedByCompany);

// get the company details and search for company
router.get("/companies", companyDetails);
router.get("/company-single/:companyId", companySingle);

router.post("/companies/company-list", searchCompanyList);
router.post("/mark-job-completed", makeJobCompleted);

// outsource jobs
// router.post("/create-outsource-jobs", authenticatedUser, createOutSourceJobs);
// router.get("/get-my-outsource-job/:userId", authenticatedUser, getMyOutSourceJob);
// router.get("/get-single-outsource-job/:jobId", getAOutSourceJob);
// router.delete("/delete-outsource-job", authenticatedUser, deleteOutSourceJob);
// router.get("/outsource-jobs-per-month", totalOutSourceJobsPerMonth);
// router.put("/complete-service", authenticatedUser, completeService);
// router.get("/get-service-requests/:userId", authenticatedUser, getServiceRequests);

//endpoint to create services request
//router.post("/create-service-request", createServiceRequest)


router.post('/onboard-service-provider', onboardingUpload.any(), organizeFiles, onboardingServiceProvider);

router.post("/provider-create-service", backgroundUpload.any("backgroundCover"), providerCreateService);

router.get("/my-gigs/:userId", myGigs);
router.get("/service-provider-dashboard/:userId", serviceProviderDashboard);
//router.get("/provider-employee-of-record/:providerId", getProviderEmployeeOfRecordJobs);
// new endpoint added
router.get("/last-four-paid-gigs/:userId", getlastFourPaidGigs)
router.get("/service-created-per-month/:userId", getServicesCreatedPerMonth)

router.get("/provider-employed-gigs/:userId", getGigsEmployed)
router.get("/provider-ongoing-employed-gigs/:userId", getOngoingEmployedGigs)
router.get("/provider-employed-completed-gigs/:userId", getCompletedEmployedGigs)

router.get("/portfolio/:filename", getPortfolioImage);
router.get("/certificate/:filename", getCertificateImage);

router.get("/get-my-services/:userId", getMyServices);
router.delete("/delete-service/:serviceId", deleteService);
router.patch("/edit-service/:serviceId", backgroundUpload.any("backgroundCover"), editService); //

module.exports = router;
