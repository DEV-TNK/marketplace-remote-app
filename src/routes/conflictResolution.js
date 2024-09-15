const express = require("express");
const router = express.Router();
const {
  conflictResolution,
  getConflictResolution,
  completedConflict,
  getMyConflictResolution,
  sendConflictResolutionFeedback
} = require("../controllers/ConflictResolutionController/conflictResolution");

const authenticatedUser = require("../middleware/authentication")

router.post("/create-conflicts", authenticatedUser, conflictResolution);
router.get("/all-conflicts", authenticatedUser, getConflictResolution);

router.put("/conflicts/:conflictResolutionId", authenticatedUser, completedConflict);
router.get("/get-my-conflict/:userId", authenticatedUser, getMyConflictResolution);
router.post("/send-conflict-resolution-feedback", authenticatedUser, sendConflictResolutionFeedback)


module.exports = router;
