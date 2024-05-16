const express = require("express");
const router = express.Router();
const userActivities = require("../controllers/ActivitiesController/UserActivities")

router.post("/create-activity", userActivities);

module.exports = router;