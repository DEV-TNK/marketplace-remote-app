const express = require("express");
const router = express.Router();

const Register = require("../controllers/UserController/Authentication/Register");
const verifyEmail = require("../controllers/UserController/Authentication/verifyEmail");
const resendEmail = require("../controllers/UserController/Authentication/resendEmail");
const Login = require("../controllers/UserController/Authentication/login");
const forgotPassword = require("../controllers/UserController/Authentication/forgotPassword");
const resetPassword = require("../controllers/UserController/Authentication/resetPassword");
const logout = require("../controllers/UserController/Authentication/logout");
const saveInterest = require("../controllers/UserController/Authentication/userInterest");
const { getFgnUsers, RegisterFgnUsers } = require("../controllers/UserController/Authentication/fgnUsers")
const {
    authLimiter,
    resetPasswordLimiter,
} = require("../middleware/RateLimiter")

router.post("/register", Register);
router.get("/get-fgn-user-details/:userId", getFgnUsers);
router.post("/register-fgnUser", RegisterFgnUsers);
router.post("/verify-email", verifyEmail);
router.post("/resend-email", resetPasswordLimiter, resendEmail);
router.post("/login", authLimiter, Login);
router.post("/forgot-password", resetPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.delete("/logout/:userId", logout);
router.post("/save-interest/:id", saveInterest);

module.exports = router;
