const JobPoster = require("../../models/JobPoster");
const Applicant = require("../../models/Applicant");
const User = require("../../models/Users");
const Offer = require("../../models/Offer")

const getAllJobPoster = async (req, res) => {
    try {
        const jobposters = await JobPoster.aggregate([
            {
                $lookup: {
                    from: "jobpostings", // Collection name of jobs
                    localField: "_id",
                    foreignField: "jobPoster",
                    as: "created_jobs"
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    companyEmail: 1,
                    companyContact: 1,
                    companyName: 1,
                    companyWebsite: 1,
                    companyLogo: 1,
                    CompanyIndustry: 1,
                    companyDescription: 1,
                    companyLocation: 1,
                    companyType: 1,
                    companyDesignation: 1,
                    totalJobs: { $size: "$created_jobs" } // Count the number of jobs
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(jobposters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// const getAllJobPoster = async (req, res) => {
//     try {
//         const jobposters = await JobPoster.find()

//         res.json(jobposters)
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

const getAllJobSeekersInfo = async (req, res) => {
    try {
        // Fetch all users who are jobseeker
        const jobSeekers = await User.findAll({
            where: { role: 'seeker' },
            attributes: { exclude: ['email', 'password', 'passwordToken', 'passwordTokenExpirationDate', 'verificationToken'] }, // Exclude email field
            order: [['createdAt', 'DESC']]
        });

        // Fetch total number of applications
        const totalApplications = await Offer.count();

        // Fetch total number of jobs with offers accepted
        const totalJobsWithOffersAccepted = await Offer.count({
            where: { status: 'accepted' }
        });
        res.json({
            jobSeekers,
            totalApplications,
            totalJobsWithOffersAccepted
        });
    } catch (error) {
        console.error('Error fetching Job Seekers information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
module.exports = {
    getAllJobPoster,
    getAllJobSeekersInfo
}