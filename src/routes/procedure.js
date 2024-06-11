const express = require("express");
const {
  getActionTypeAnalytics,
  deviceTracking,
} = require("../controllers/procedureController/fileView");
const router = express.Router();

router.get("/get-action-type-analytics", getActionTypeAnalytics);
router.get("/device-tracking", deviceTracking);

module.exports = router;
