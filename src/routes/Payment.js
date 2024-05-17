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
} = require("../controllers/PaymentController/AccountController");
const {
  savePaymentRecord,
  getPaymentRecords,
} = require("../controllers/PaymentController/PaymentRecordController");

router.post("/provider-payment", providerJobPayment);

//accoun routes
router.post("/save-bank-details", saveJobSeekerAccount);
router.get("/bank-details/:userId", getUserBankDetails);

//Seeker payment records routes
router.post("/save-payment-records", savePaymentRecord);
router.get("/get-payment-records", getPaymentRecords);

//provider Transactions
router.get("/provider-transactions/:userId", allProviderTransaction);
router.get("/get-all-payment-records", getAllPayment);

// Payment request
router.post("/create-payment-request", paymentRequest),
  router.get("/all-payment-request", allSeekerWithdrawRequest);


module.exports = router;
