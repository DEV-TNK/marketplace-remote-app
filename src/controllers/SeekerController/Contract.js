const User = require("../../models/Users")
const Payment = require("../../models/ProviderTransaction")
const Offer = require("../../models/Offer")
const JobPosting = require("../../models/Job")
const {SeekerEarning} = require("../../models/SeekerPaymentRecords")


const myContract = async (req, res) => {
    try {
      const userId = req.params.userId;
if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
}

const offers = await Offer.findAll({ where: { jobSeeker: userId, status: "accepted" } });
const jobIds = offers.map(offer => offer.jobId);
console.log("this is jobsId", jobIds)

const jobsWork = await JobPosting.find({ _id: { $in: jobIds }, paymentStatus: "paid", status: "Ongoing"  }).populate({
    path: 'jobPoster',
    select: 'companyName companyLogo' 
});
console.log("this is job work", jobsWork)
const jobsPending = await JobPosting.find({ _id: { $in: jobIds }, paymentStatus: "paid", status: "Completed", amountAvalabilityStatus: "false"  }).populate({
    path: 'jobPoster',
    select: 'companyName companyLogo' 
});
const totalAmountPending = jobsPending.reduce((acc, job) => acc + parseFloat(job.jobSalary.replace(/,/g, '')), 0);
const totalAmount = jobsWork.reduce((acc, job) => acc + parseFloat(job.jobSalary.replace(/,/g, '')), 0);
const seekerEarning = await SeekerEarning.findOne({ where: { userId: userId } });
let availableAmount;
if(seekerEarning){
    availableAmount = seekerEarning.totalAmount
} else {
    availableAmount = "0"
}

const workInProgress = { totalAmount, jobsWork };
const pendingContract = {totalAmountPending, jobsPending}
// const availableAmount 
 return res.json({workInProgress, pendingContract, availableAmount});

        
    } catch (error) {
        console.error('Error fetching jobs for job seeker:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = myContract