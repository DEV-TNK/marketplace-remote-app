const express = require("express");
const router = express.Router();

const {
  userContactUs,
  allContactUs,
  contactUsCompleted,
  sendContactUsFeedback
} = require("../controllers/CustomerCareController/contactUs");

router.post("/contact-us", userContactUs);
router.get("/all-contact-us", allContactUs);
router.put("/contact-us/:id/completed", contactUsCompleted);
router.post("/send-contact-us-feedback", sendContactUsFeedback);

module.exports = router;
