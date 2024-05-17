const Applicant = require("../../models/Applicant");
const JobPosting = require("../../models/Job");
const JobPoster = require("../../models/JobPoster");
const Offer = require("../../models/Offer");
//const { SeekerResume } = require("../models/SeekerResume");

const getMyJobs = async (req, res) => {
    try {

        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const offers = await Offer.findAll({ where: { jobSeeker: userId, status: "accepted" } });

        const jobIds = offers.map(offer => offer.jobId);
        const jobs = await JobPosting.find({ _id: { $in: jobIds } }).populate({
                path: 'jobPoster',
                select: 'companyName companyLogo' 
            }).sort({ createdAt: -1 });
            
        return res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs for job seeker:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getJobSeekerOngoingJobs = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const offers = await Offer.findAll({ where: { jobSeeker: userId, status: "accepted" } });
        const jobIds = offers.map(offer => offer.jobId);
        const jobs = await JobPosting.find({ _id: { $in: jobIds }, status: "Ongoing" }).populate({
            path: 'jobPoster',
            select: 'companyName companyLogo'
        }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching ongoing jobs for jobseeker:', error);
        res.status(500).json({ error: 'Internal Server Error. Failed to fetch ongoing jobs for jobseeker.' });
    }

}

const getJobSeekerCompletedJobs = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const offers = await Offer.findAll({ where: { jobSeeker: userId, status: "accepted" } });
        const jobIds = offers.map(offer => offer.jobId);
        const jobs = await JobPosting.find({ _id: { $in: jobIds }, status: "Completed" }).populate({
            path: 'jobPoster',
            select: 'jobPosterId companyName companyLogo'
        }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching completed jobs for jobseeker:', error);
        res.status(500).json({ error: 'Internal Server Error. Failed to fetch completed jobs for jobseeker.' });
    }
}


module.exports = { getMyJobs, getJobSeekerOngoingJobs, getJobSeekerCompletedJobs }



