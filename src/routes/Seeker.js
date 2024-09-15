const express = require("express");
const router = express.Router();



const {
  updateOrCreateSeekerResume,
  getUserResumeDetails,
  getAResume,
  getMyResume,
} = require("../controllers/SeekerController/SeekerResume");
const {
  jobApplication,
  totalJobsApplied,
  myOfferLetter,
  acceptOrRejectOffer,
  getApplicationsBySeeker,
} = require("../controllers/SeekerController/JobApplication");
const {
  getSeekerEarning,
  getAllSeekerPaymentRequest,
} = require("../controllers/SeekerController/Earning");
const multer = require("multer");
const {
  getMyJobs,
  getJobSeekerOngoingJobs,
  getJobSeekerCompletedJobs,
} = require("../controllers/SeekerController/myJobs");
const {
  getJobSeekerDashboardData,
  getLastApprovedJobs,
  uploadSeekerImage,
} = require("../controllers/SeekerController/seekerDashboard");

const {
  getRecommendation,
  fgnAlatRecommendedJpbs,
} = require("../controllers/SeekerController/SeekerLanding");


const {
  // createService,
  getFgnAlatRecommendedServices,
} = require("../controllers/SeekerController/Service");
const myContract = require("../controllers/SeekerController/Contract");
const {
  requestService,
  //saveOrderSummary,
  getOrderSummary,
  //updateServiceRequestStatus,
  updateServiceRequestStatusCompleted,
  likeService,
  getAProvidserService,
  getAllServices,
  serviceByDepartment,
  totalServicePerMonth,
  servicesSearch } = require("../controllers/ServiceSeekerController/serviceSeeker");


//Seeker Service Controller
const {
  getSeekerServiceDashboardData,
  getLastFourCompletedServices,
  getAllServicesRequest,
  getOngoingServiceRequest,
  getCompletedServiceRequest } = require("../controllers/ServiceSeekerController/Dashboard");
const authenticatedUser = require("../middleware/authentication");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

const serviceStorage = multer.diskStorage({});
const serviceUpload = multer({ storage: serviceStorage });

const storageSeeker = multer.diskStorage({});

const uploadSeeker = multer({ storage: storageSeeker });

router.post("/seeker-resume", authenticatedUser, upload.single("resume"), updateOrCreateSeekerResume);
router.post("/seeker-upload-image", uploadSeeker.single("image"), uploadSeekerImage);

router.post("/apply-for-job", authenticatedUser, getUserResumeDetails);

router.post("/submit-job-application", authenticatedUser, jobApplication);
router.get("/get-a-resume/:filename", authenticatedUser, getAResume);
router.get("/get-my-resume/:userId", authenticatedUser, getMyResume);

router.get("/get-my-offers/:userId", authenticatedUser, myOfferLetter);
router.get("/seeker-recommendation/:userId", authenticatedUser, getRecommendation);
router.get("/FGN-ALAT-seeker-job-recommendation/:userId", fgnAlatRecommendedJpbs);
//router.get("/FGN-ALAT-seeker-recommended-services/:email", getFgnAlatRecommendedServices);

router.get("/total-jobs-applied/", totalJobsApplied);
router.post("/accept-reject-offer", authenticatedUser, acceptOrRejectOffer);
router.get("/seeker-monthly-applications/:userId", authenticatedUser, getApplicationsBySeeker);
// router.get(
//   "/seeker-monthly-applications/:seekerUserId",
//   getApplicationsBySeeker
// );

//route to get my jobs
router.get("/seeker-jobs/:userId", authenticatedUser, getMyJobs);
router.get("/seeker-ongoing-jobs/:userId", authenticatedUser, getJobSeekerOngoingJobs);
router.get("/seeker-completed-jobs/:userId", authenticatedUser, getJobSeekerCompletedJobs);

//get job seeker dashbooard data
router.get("/dashboard/:userId", authenticatedUser, getJobSeekerDashboardData);
router.get("/last-approved-jobs/:userId", authenticatedUser, getLastApprovedJobs);

// service
// router.post("/create-service", serviceUpload.single("image"), createService);



router.get("/get-all-services", getAllServices);
router.post("/search-services", servicesSearch);
router.get("/get-my-contract/:userId", authenticatedUser, myContract);
router.get("/get-provider-service/:serviceId", authenticatedUser, getAProvidserService)
router.put("/like/service", likeService);
router.get("/services-by-department", serviceByDepartment);
router.get("/service-per-month", totalServicePerMonth);


//router.get("/FGN-ALAT-seeker-recommended-services/:userId", getFgnAlatRecommendedServices);

// seeker earning
router.get("/get-my-earning/:userId", authenticatedUser, getSeekerEarning);
router.get("/get-my-withdrawHistory/:userId", authenticatedUser, getAllSeekerPaymentRequest);

router.post("/request-service", authenticatedUser, requestService)
router.get("/get-order-summary/:userId", authenticatedUser, getOrderSummary)
//router.put("/ongoing-service-request", updateServiceRequestStatus);
router.put("/complete-service-request", authenticatedUser, updateServiceRequestStatusCompleted)
//router.post("/save-order-summary", saveOrderSummary)

//Service seeker Dashboard Data Routes
router.get("/service-seeker-dashboard/:userId", authenticatedUser, getSeekerServiceDashboardData)
router.get("/last-four-completed-services/:userId", authenticatedUser, getLastFourCompletedServices)
router.get("/all-services-request/:userId", authenticatedUser, getAllServicesRequest)
router.get("/ongoing-services-request/:userId", authenticatedUser, getOngoingServiceRequest)
router.get("/completed-services-request/:userId", authenticatedUser, getCompletedServiceRequest)


module.exports = router;
