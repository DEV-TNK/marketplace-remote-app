const express = require("express");
const router = express.Router();

const {
  providerJobPayment,
  allProviderTransaction,
  getAllPayment,
  paymentRequest,
  allSeekerWithdrawRequest,
} = require("../controllers/PaymentController/Payment");
const {
  saveJobSeekerAccount,
  getUserBankDetails,
  editAccountDetails,
} = require("../controllers/PaymentController/AccountController");
const {
  savePaymentRecord,
  getPaymentRecords,
} = require("../controllers/PaymentController/PaymentRecordController");
const authenticatedUser = require("../middleware/authentication")

router.post("/provider-payment", authenticatedUser, providerJobPayment);

//account routes
router.post("/save-bank-details", authenticatedUser, saveJobSeekerAccount);
router.get("/bank-details/:userId", authenticatedUser, getUserBankDetails);
router.put("/edit-account", authenticatedUser, editAccountDetails)

//Seeker payment records routes
router.post("/save-payment-records", authenticatedUser, savePaymentRecord);
router.get("/get-payment-records", authenticatedUser, getPaymentRecords);

//provider Transactions
router.get("/provider-transactions/:userId", authenticatedUser, allProviderTransaction);
router.get("/get-all-payment-records", authenticatedUser, getAllPayment);

// Payment request
router.post("/create-payment-request", authenticatedUser, paymentRequest),
  router.get("/all-payment-request", authenticatedUser, allSeekerWithdrawRequest);


module.exports = router;
