const Job = require("../../models/Job")
const JobPoster = require("../../models/JobPoster");
const User = require("../../models/Users")
const { SeekerPendingAmount } = require("../../models/SeekerPaymentRecords")
const ProviderTransaction = require("../../models/ProviderTransaction")
const Offer = require("../../models/Offer")

const getMyJobs = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ message: `User Id is required` });
        }
        const user = await JobPoster.findOne({ jobPosterId: userId })
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const jobs = await Job.find({ jobPoster: user._id }).sort
            ({
                createdAt
                    : -
                    1
            });

        const OngoingJobs = await Job.aggregate([
            { $match: { jobPoster: user._id, status: "Ongoing" } },
            { $sort: { createdAt: -1 } },
        ]);

        const completedPosterJobs = await Job.aggregate([
            { $match: { jobPoster: user._id, status: "Completed" } },
            { $sort: { createdAt: -1 } },
        ]);
        const completedJob = await Promise.all(
            completedPosterJobs.map(async (job) => {
                // Find the offer with status "accepted" for the completed job
                const acceptedOffer = await Offer.findOne({
                    where: {
                        jobId: job._id.toString(),
                        status: "accepted",
                    },

                });

                if (acceptedOffer) {
                    // Extract the job seeker ID from the accepted offer
                    const jobSeekerId = acceptedOffer.jobSeeker;

                    // Find the user associated with the job seeker ID
                    const jobSeekerUser = await User.findByPk(jobSeekerId);

                    // Add the user ID and username to the job object
                    job.userId = jobSeekerUser.id;
                    job.userName = jobSeekerUser.username;
                }

                return job;
            })
        );
        return res.status(200).json({ jobs, OngoingJobs, completedJob });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error", error });
    }
}

const makeJobCompleted = async (req, res) => {
    await SeekerPendingAmount.sync();
    try {
        const { userId, jobId } = req.body
        const details = [
            "jobId",
            "userId"
        ]
        for (const detail of details) {
            if (!req.body[detail]) {
                return res.status(400).json({ message: `${detail} is required` });
            }
        }
        console.log("This is the error")
        const user = await JobPoster.findOne({ jobPosterId: userId })
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        console.log("This is the error2")

        const jobDetail = await Job.findById(jobId)
        if (!jobDetail) {
            return res.status(404).json({ message: "Job does not exist" });
        }
        console.log("This is the error3")
        console.log("this is jobDetails", jobDetail)
        if (jobDetail.paymentStatus === "paid") {
            jobDetail.status = "Completed"
            await jobDetail.save()
            console.log("This is the error4")
            const paidAmount = await ProviderTransaction.findOne({
                where: {
                    jobId: jobId,
                },
            });
            console.log("this is transaction", paidAmount)
            if (!paidAmount) {
                return res.status(404).json({ message: "No payment found for this job" });
            }
            const seeker = await Offer.findOne({
                where: {
                    jobId: jobId,
                    status: "accepted"
                },
            });

            const show = await SeekerPendingAmount.create({
                userId: seeker.jobSeeker,
                jobId,
                currency: paidAmount.currency,
                jobTitle: jobDetail.jobTitle,
                jobAmount: jobDetail.jobSalary,
                paidAmount: paidAmount.amount
            })
            return res.status(200).json({ message: "Job Status Updated Successfully", show });
        } else if (jobDetail.paymentStatus === "unpaid") {
            return res.status(200).json({ message: "Job Payment has not been made" });
        } else {
            return res.status(200).json({ message: "Job has been completed" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = { getMyJobs, makeJobCompleted }