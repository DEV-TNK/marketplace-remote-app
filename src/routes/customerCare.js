const express = require("express");
const router = express.Router();

const {
  userContactUs,
  allContactUs,
  contactUsCompleted,
  sendContactUsFeedback
} = require("../controllers/CustomerCareController/contactUs");
const authenticatedUser = require("../middleware/authentication")

router.post("/contact-us", userContactUs);
router.get("/all-contact-us", authenticatedUser, allContactUs);
router.put("/contact-us/:id/completed", authenticatedUser, contactUsCompleted);
router.post("/send-contact-us-feedback", authenticatedUser, sendContactUsFeedback)

module.exports = router;
