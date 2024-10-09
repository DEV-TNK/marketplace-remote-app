const Applicant = require("../../models/Applicant")
const Job = require("../../models/Job")
const JobPoster = require("../../models/JobPoster");
const { Op } = require("sequelize");
const { SeekerResume, Employment } = require("../../models/SeekerResume");
const Offer = require("../../models/Offer")
const User = require("../../models/Users")
const sendOfferLetterEmail = require("../../utils/sendJobOfferLetter")
const sendRejectLetterEmail = require("../../utils/sendJobRejectLetter")

const myJobApplication = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ message: `User Id is required` });
        }
        const user = await JobPoster.findOne({ jobPosterId: userId })
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const jobs = await Job.find({ jobPoster: user._id, });

        // Extract job ids from the found jobs
        const jobIds = jobs.map(job => job._id.toString());

        // Find all applicants for the extracted job ids
        const applicants = await Applicant.findAll({
            where: {
                jobId: { [Op.in]: jobIds },
                status: "pending"
            },
            order: [['createdAt', 'DESC']],
        });

        // Eagerly load the seeker resume information for each applicant
        for (const applicant of applicants) {
            const seekerResume = await SeekerResume.findOne({ where: { userId: applicant.userId } });
            const job = jobs.find(job => job._id.toString() === applicant.jobId);
            const userImage = await User.findByPk(applicant.userId)
            applicant.setDataValue('JobTitle', job ? job.jobTitle : "Unknown");
            applicant.setDataValue('userImage', userImage ? userImage.imageUrl : "");
            applicant.setDataValue('seekerResume', seekerResume);
        }

        return res.status(200).json({ applicants });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error", error });
    }
}

const sendOffer = async (req, res) => {
    Offer.sync();
    try {
        const { jobId, jobPoster, jobSeeker, status } = req.body
        const details = [
            "jobId",
            "jobPoster",
            "jobSeeker",
            "status",
        ]
        for (const detail of details) {
            if (!req.body[detail]) {
                return res.status(400).json({ message: `${detail} is required` });
            }
        }
        const duplicateOffer = await Offer.findOne({
            where: {
                jobId: jobId,
                jobSeeker: jobSeeker,
                status: "pending"
            },
        })
        if (duplicateOffer) {
            return res.status(400).json({ message: `You have Previously Sent Offer to this User` });
        }

        const findOffer = await Offer.findOne({
            where: {
                jobId: jobId,
                status: "accepted"
            },
        })
        if (findOffer) {
            return res.status(400).json({ message: `Job offer have been accepted by another user` });
        }

        const applicants = await Applicant.findOne({
            where: {
                jobId: jobId,
                userId: jobSeeker,
            },
        });

        if (!applicants) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        applicants.status = "completed"
        await applicants.save()

        const user = await User.findByPk(jobSeeker)
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const job = await Job.findOne({ _id: jobId }).populate({
            path: "jobPoster",
            select: "companyName",
        })
        if (!job) {
            return res.status(404).json({ message: "Job does not exist" });
        }
        if (status === "true") {
            const offerLetter = await Offer.create({
                jobId: jobId,
                jobPoster: jobPoster,
                jobSeeker: jobSeeker,
            })
            await sendOfferLetterEmail({
                username: user.username,
                email: user.email,
                title: job.jobTitle,
                price: job.jobSalary,
                jobProvider: job.jobPoster.companyName,
                description: job.jobDescription,
                deliveryDate: job.deliveryDate,
                type: job.jobType
            })

            return res.status(201).json({ message: "Offer Letter Sent", offerLetter });
        } else {
            await sendRejectLetterEmail({
                username: user.username,
                email: user.email,
                title: job.jobTitle,
                jobProvider: job.jobPoster.companyName,
            })
            return res.status(200).json({ message: "Application Rejected Successfully" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error", error });
    }
}

module.exports = { myJobApplication, sendOffer }