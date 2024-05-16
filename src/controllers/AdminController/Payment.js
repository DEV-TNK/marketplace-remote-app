const Offer = require("../../models/Offer");
const JobPosting = require("../../models/Job")
const {SeekerPendingAmount, SeekerEarning, PaymentRequest} = require("../../models/SeekerPaymentRecords")
const User = require("../../models/Users")
const sendSeekerJobPaymentEmail = require("../../utils/sendSeekerPaymentApproval")
const sendPaymentRequestApprovalEmail = require("../../utils/paymentRequestApprovalEmail")
const Account = require("../../models/Accounts")


const seekerPendingPayment = async (req, res) => {
    try {
        const pendingPayment = await SeekerPendingAmount.findAll({ where: { status: "pending",  }, 
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['id', 'username', 'imageUrl', 'email'] }] 
    });
        res.json(pendingPayment);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
}

const acceptOrRejectPayment = async (req, res) => {
     await SeekerEarning.sync();
    try {

        const {pendingId,  status, } = req.body
         const details = [
            "pendingId",
            "status",
        ]
        for (const detail of details) {
            if (!req.body[detail]) {
                return res.status(400).json({ message: `${detail} is required` });
            }
        }

        let findPending = await SeekerPendingAmount.findByPk(pendingId)
       
        if(!findPending){
            return res.status(404).json({message: "Payment request does not exist"});
        }
        //  if(findPending.status === "completed"){
        //     return res.status(400).json({message: "Payment request have been approved before"});
        // }
       
        if(status === "true"){
            const job = await JobPosting.findById(findPending.jobId)
            
            job.amountAvalabilityStatus = "true"
            await job.save()

             let findUser = await SeekerEarning.findOne({
        where: {
          userId: findPending.userId,
        },
         include: [
                { model: User, attributes: ['email', "username"] }
            ]
      });
            
      console.log("this is user", findUser)
      const currency = findPending.currency.toUpperCase();
      if(!findUser){
        const amountConvert = parseInt(findPending.jobAmount.replace(/,/g, ""));
        console.log("this is amount converted", amountConvert)
         const showEarning = await SeekerEarning.create({
                userId: findPending.userId,
                [currency]: amountConvert,
            })
            findPending.status = "completed"
            await findPending.save()
            await sendSeekerJobPaymentEmail({
                username:findUser.User.username,
                email: findUser.User.email,
                jobTitle: findPending.jobTitle,
                price: findPending.jobAmount,
            })
            return res.status(201).json({message: "Payment made Available Successfully", showEarning, findPending});
      } else {
        const amountConvert = parseFloat(findPending.jobAmount.replace(/,/g, "")); 
        // findUser.totalAmount = parseFloat(findUser.totalAmount) + amountConvert; 
        findUser[currency] += amountConvert;
        await findUser.save();
        findPending.status = "completed"
            await findPending.save()
            await sendSeekerJobPaymentEmail({
                username:findUser.User.username,
                email: findUser.User.email,
                jobTitle: findPending.jobTitle,
                price: findPending.jobAmount,
            })
        return res.status(201).json({message: "Payment made Available Successfully", findUser, findPending});
      }
    }
        findPending.status = "rejected"
            await findPending.save()
        return res.status(201).json({message: "Payment rejected Successfully"});

           
    } catch (error) {
         console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
    
}

const markWithdrawalRequest = async (req, res) => {
    try {
        const {requestId, status} = req.body
        const findRequest = await PaymentRequest.findByPk(requestId, {
            include: [
                { model: Account, attributes: ['accountName', 'accountNumber', 'bankName'] },
                { model: User, attributes: ['email', 'username'] }
            ]
        })
        if(!findRequest){
            return res.status(404).json({message: "Payment request does not exist"});
        }
        if(status === 'true'){
            findRequest.status = "completed"
            await sendPaymentRequestApprovalEmail({
                username: findRequest.User.username,
                email: findRequest.User.email,
                amount: findRequest.amount,
                accountNumber: findRequest.Account.accountNumber,
                bankName: findRequest.Account.bankName,
                accountName: findRequest.Account.accountName
            })
            await findRequest.save()
            return res.status(201).json({message: "Payment Completed Successfully"});
        } else {
             findRequest.status = "rejected"
            await findRequest.save()
            return res.status(201).json({message: "Payment Rejected Successfully"});
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
}


module.exports = {seekerPendingPayment, acceptOrRejectPayment, markWithdrawalRequest}
