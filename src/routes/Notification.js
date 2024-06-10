const express = require("express");
const { sendPaymentNotification, sendMarkJobCompletionNotification } = require("../controllers/NotificationController/Notification");
const router = express.Router();


router.post("/send-payment-notification", sendPaymentNotification)
router.post("/send-job-completion-notification", sendMarkJobCompletionNotification)

module.exports = router