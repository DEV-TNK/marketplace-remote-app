const express = require("express");
const router = express.Router();
const { socialProfile, getSocial } = require("../controllers/SettingController/SocialProfile");
// const {updateProfile, getUserData} = require("../controllers/SettingController/Profile");
const DeleteAccount = require("../controllers/SettingController/DeleteAccount");

const multer = require("multer");

// Set up multer for handling multipart/form-data
const storage = multer.diskStorage({});
const upload = multer({ storage });



// router.post("/update-profile/:userId",  upload.single("image"), updateProfile);
router.get("/get-social-profile/:userId", getSocial);
// router.get("/get-user-details/:userId", getUserData);


router.post("/update-social", socialProfile);
router.delete("/user/:userId", DeleteAccount);

module.exports = router;
