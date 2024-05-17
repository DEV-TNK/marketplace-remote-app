const express = require("express");
const router = express.Router();
const {
  conflictResolution,
  getConflictResolution,
  completedConflict,
  getMyConflictResolution
} = require("../controllers/ConflictResolutionController/conflictResolution");

router.post("/create-conflicts", conflictResolution);
router.get("/all-conflicts", getConflictResolution);

router.put("/conflicts/:conflictResolutionId", completedConflict);
router.get("/get-my-conflict/:userId", getMyConflictResolution);


module.exports = router;
