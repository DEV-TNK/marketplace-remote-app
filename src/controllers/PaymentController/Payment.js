const https = require("https");
const ProviderTransaction = require("../../models/ProviderTransaction");
const { PaymentRequest, SeekerEarning } = require("../../models/SeekerPaymentRecords");
const Job = require("../../models/Job");
const sendSeekerJobPaymentEmail = require("../../utils/seekerJobPaymentAlert");
const User = require("../../models/Users");
const sendProviderJobPaymentEmail = require("../../utils/providerPaymentAlert");
const offer = require("../../models/Offer");
const JobPoster = require("../../models/JobPoster");
const sendSeekerWithdrawalEmail = require("../../utils/sendSeekerWithdrawalRequest")
const Account = require("../../models/Accounts")
const outSourceJobs = require("../../models/OutSource")
const sendProviderOutSourcJobPaymentEmail = require("../../utils/OutSourceJobPaymentAlert")


// payment helper function

const verifyPayment = async (reference, provider) => {
  let options;
  if (provider === "paystack") {
    options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };
  } else if (provider === "flutterwave") {
    options = {
      hostname: "api.flutterwave.com",
      port: 443,
      path: `/v3/transactions/${reference}/verify`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, // Replace with your Flutterwave secret key
      },
    };
  }

  try {
    const apiRes = await new Promise((resolve, reject) => {
      const apiReq = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(data);
        });
      });

      apiReq.on("error", (error) => {
        reject(error);
      });

      apiReq.end();
    });

    return JSON.parse(apiRes);
  } catch (error) {
    throw error;
  }
};

const providerJobPayment = async (req, res) => {
  await ProviderTransaction.sync();

  const { reference, email, jobId, userId, type, currency, provider } = req.body;
  const details = ["reference", "email", "jobId", "userId", "type", "currency", "provider"];
  // Check if userId is provided
  for (const detail of details) {
    if (!req.body[detail]) {
      return res.status(400).json({ message: `${detail} is required` });
    }
  }
  try {
    const responseData = await verifyPayment(reference, provider);

    console.log("This is the amount", responseData)

    // CONVERT amount 




    if (type === "JOB") {
      // for paystack
      // const convertAmount = responseData.data.amount / 100;
      // for flutterwave
      const convertAmount = responseData.data.amount;


      const getJob = await Job.findOne({ _id: jobId }).populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      });
      if (!getJob) {
        return res.status(400).json({ message: `Job does not exist` });
      }

      const offerDetails = await offer.findOne({
        where: {
          jobId: jobId,
          status: "accepted",
        },
      });
      console.log("this is offer details", offerDetails);
      const userSeeker = await User.findOne({
        where: {
          id: offerDetails.jobSeeker,
        },
      });
      if (!userSeeker) {
        return res
          .status(400)
          .json({ message: `No Job seeker associated with this job` });
      }
      const userTransaction = await ProviderTransaction.create({
        email: email,
        jobId: jobId,
        amount:  responseData.data.amount,
        paymentMethod: responseData.data.payment_type,
        transactionDate: responseData.data.created_at,
        jobTitle: getJob.jobTitle,
        userId: userId,
        status: "success",
        type: type,
        currency: currency
      });
      const amount = parseInt(getJob.jobSalary.replace(/,/g, ""));
      console.log("this is amount", amount);



      if (responseData.data.status === "successful" && convertAmount === amount) {
        const jobUpdate = await Job.findOneAndUpdate(
          { _id: jobId },
          { $set: { status: "Ongoing", paymentStatus: "paid" } },
          { new: true } // Return the updated document
        );
        await sendSeekerJobPaymentEmail({
          username: userSeeker.username,
          email: userSeeker.email,
          jobTitle: getJob.jobTitle,
          price: getJob.jobSalary,
          jobProvider: getJob.jobPoster.companyName,
          description: getJob.jobDescription,
          deliveryDate: getJob.deliveryDate,
          type: getJob.jobType,
          currency: currency 
        });
        await sendProviderJobPaymentEmail({
          username: getJob.jobPoster.companyName,
          email: email,
          jobTitle: getJob.jobTitle,
        });
        return res.status(201).json({
          message: "Job Payment Successful",
          responseData,
          jobUpdate,
          userTransaction,
        });
      }
    } else if (type === "Out-Source") {
      const flutterAmount = responseData.data.amount;
      const getOutSourceJob = await outSourceJobs.findOne({ _id: jobId }).populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      });

      if (!getOutSourceJob) {
        return res.status(400).json({ message: `Job does not exist` });
      }

      const userTransaction = await ProviderTransaction.create({
        email: email,
        jobId: jobId,
        amount: responseData.data.amount,
        paymentMethod: responseData.data.payment_type,
        transactionDate: responseData.data.created_at,
        jobTitle: "Out-Source Job",
        userId: userId,
        status: "success",
        type: type,
        currency: currency
      });

      const totalAmount = getOutSourceJob.jobs.reduce((total, job) =>
        total + parseFloat(job.price) * job.numberOfPerson,
        0)
      console.log("this is total amount", totalAmount)
      console.log("this is flutterAmount", flutterAmount)
      console.log("this is status", responseData.data.status)


      if (responseData.data.status === "successful" && flutterAmount === totalAmount) {

        const jobUpdate = await outSourceJobs.findOneAndUpdate(
          { _id: jobId },
          { $set: { paymentStatus: "paid" } },
          { new: true } // Return the updated document
        );
        const totalNumber = getOutSourceJob.jobs.reduce((total, job) =>
          total + job.numberOfPerson,
          0)
        await sendProviderOutSourcJobPaymentEmail({
          username: getOutSourceJob.jobPoster.companyName,
          email: email,
          num: totalNumber,
          price: totalAmount
        });
        return res.status(201).json({
          message: "Job Payment Successful",
          responseData,
          jobUpdate,
          userTransaction,
        });
      }

    }

    // Send the parsed object as the response
    return res.status(201).json({ message: "Payment Successfull" })
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred during payment verification" });
  }
};


const allProviderTransaction = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
    }

    const transactions = await ProviderTransaction.findAll({
      where: {
        userId: userId,

      },

      order: [["transactionDate", "DESC"]],
    });

    // Return the transactions in the response
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching provider transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPayment = async (req, res) => {
  try {

    const allPayment = await ProviderTransaction.findAll({
      order: [['createdAt', 'DESC']],
    });

    // Extract unique user IDs from these payment transactions
    const userIds = allPayment.map((payment) => payment.userId);

    // Fetch job posters from MongoDB based on the userIds
    const jobPosters = await JobPoster.find({ jobPosterId: { $in: userIds } });

    // Create a map to easily look up job poster details by userId
    const jobPosterLookup = jobPosters.reduce((lookup, jobPoster) => {
      lookup[jobPoster.jobPosterId] = {
        companyName: jobPoster.companyName,
        companyLogo: jobPoster.companyLogo,
      };
      return lookup;
    }, {});

    // Map the payment transactions to include job poster details
    const paymentsWithDetails = allPayment.map((payment) => ({
      id: payment.id,
      email: payment.email,
      jobId: payment.jobId,
      userId: payment.userId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionDate: payment.transactionDate,
      jobTitle: payment.jobTitle,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      jobPoster: jobPosterLookup[payment.userId],
    }));

    return res.json({ records: paymentsWithDetails });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred during payment verification" });
  }
};

const paymentRequest = async (req, res) => {
  await PaymentRequest.sync();
  try {
    const { userId, accountId, amount, currency } = req.body;

    if (!userId || !accountId || !amount || !currency) {
      return res
        .status(400)
        .json({ message: "Incomplete payment request data" });
    }
    const getUserEarning = await SeekerEarning.findOne({
      where: {
        userId: userId,
      },
    });
    if (!getUserEarning) {
      return res
        .status(404)
        .json({ message: "User have no earnings to widthdraw from" });
    }
    const convertedAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : parseFloat(amount);
    console.log("User earning:", getUserEarning.dataValues.NGN)
    const currencyBalance = getUserEarning[currency];
    if (!currencyBalance || currencyBalance < convertedAmount) {

      return res
        .status(400)
        .json({ message: "You do not have sufficient amount to make this withdrawal request" });
    }

    const newPaymentRequest = await PaymentRequest.create({
      userId,
      accountId,
      amount: convertedAmount,
      currency,
      status: "pending",
    });
    getUserEarning[currency] -= convertedAmount
    await getUserEarning.save()
    const user = await User.findByPk(userId)

    await sendSeekerWithdrawalEmail({
      username: user.username,
      email: user.email,
      amount: convertedAmount.toString()
    })
    res.status(201).json({
      message: "Payment request created successfully",
      paymentRequest: newPaymentRequest,
    });
  } catch (error) {
    console.error("Error creating payment request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const allSeekerWithdrawRequest = async (req, res) => {
  try {
    const allPaymentRequests = await PaymentRequest.findAll({
      order: [['requestDate', 'DESC']],
      include: [
        { model: Account, attributes: ['accountName', 'accountNumber', 'bankName'] },
        { model: User, attributes: ['email', 'username'] }
      ]
    });

    return res.status(200).json({ paymentRequests: allPaymentRequests });
  } catch (error) {
    console.error("Error retrieving pending payment requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  providerJobPayment,
  allProviderTransaction,
  getAllPayment,
  paymentRequest,
  allSeekerWithdrawRequest,
};

