const express = require("express");
const router = express.Router();
const {
  updateOrCreateSeekerResume,
  getUserResumeDetails,
  getAResume,
  getMyResume,
  getImages,
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
  createService,
  getMyServices,
  getAService,
  getAllServices,
  servicesSearch,
  editSeekerServices,
  deleteSeekerService,
  serviceByDepartment,
  totalServicePerMonth,
  getFgnAlatRecommendedServices,
  providerCreateService,
  likeService,
} = require("../controllers/SeekerController/Service");
const myContract = require("../controllers/SeekerController/Contract");

const {
  UserStorage,
  seekerResume
} = require("../helper/multerUpload")

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

const uploadUserImage = multer({
  storage: UserStorage,
  limits: {
    fileSize: 10485760, 
  },
});

const uploadSeekerResume = multer({
  storage: seekerResume,
  limits: {
    fileSize: 10485760, 
  },
});

router.post(
  "/seeker-resume",
  uploadSeekerResume.single("resume"),
  updateOrCreateSeekerResume
);
router.post(
  "/seeker-upload-image",
  uploadUserImage.single("image"),
  uploadSeekerImage
);

router.post("/apply-for-job", getUserResumeDetails);

router.post("/submit-job-application", jobApplication);
router.get("/get-a-resume/:filename", getAResume);
router.get("/get-my-resume/:userId", getMyResume);
router.get("/get-an-images/:filename", getImages);

router.get("/get-my-offers/:userId", myOfferLetter);
router.get("/seeker-recommendation/:userId", getRecommendation);
router.get(
  "/FGN-ALAT-seeker-job-recommendation/:userId",
  fgnAlatRecommendedJpbs
);
router.get(
  "/FGN-ALAT-seeker-recommended-services/:email",
  getFgnAlatRecommendedServices
);

router.get("/total-jobs-applied/", totalJobsApplied);
router.post("/accept-reject-offer", acceptOrRejectOffer);
router.get("/seeker-monthly-applications/:userId", getApplicationsBySeeker);
// router.get(
//   "/seeker-monthly-applications/:seekerUserId",
//   getApplicationsBySeeker
// );

//route to get my jobs
router.get("/seeker-jobs/:userId", getMyJobs);
router.get("/seeker-ongoing-jobs/:userId", getJobSeekerOngoingJobs);
router.get("/seeker-completed-jobs/:userId", getJobSeekerCompletedJobs);

//get job seeker dashbooard data
router.get("/dashboard/:userId", getJobSeekerDashboardData);
router.get("/last-approved-jobs/:userId", getLastApprovedJobs);

// service
router.post("/create-service", serviceUpload.single("image"), createService);
router.post(
  "/provider-create-service",
  serviceUpload.any("backgroundCover"),
  providerCreateService
);
router.get("/get-my-services/:userId", getMyServices);
router.get("/get-a-service/:serviceId", getAService);
router.get("/get-all-services", getAllServices);
router.post("/search-services", servicesSearch);
router.get("/get-my-contract/:userId", myContract);
router.patch(
  "/edit-service/:serviceId",
  serviceUpload.any("backgroundCover"),
  editSeekerServices
); //
router.put("/like/service", likeService);
router.delete("/delete-service/:serviceId", deleteSeekerService);
router.get("/services-by-department", serviceByDepartment);
router.get("/service-per-month", totalServicePerMonth);
router.get(
  "/FGN-ALAT-seeker-recommended-services/:userId",
  getFgnAlatRecommendedServices
);

// seeker earning
router.get("/get-my-earning/:userId", getSeekerEarning);
router.get("/get-my-withdrawHistory/:userId", getAllSeekerPaymentRequest);

module.exports = router;
