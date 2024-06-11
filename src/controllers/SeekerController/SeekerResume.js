const { SeekerResume, Employment } = require("../../models/SeekerResume");
const User = require("../../models/Users");
const JobPosting = require("../../models/Job");
const express = require('express');
const path = require('path');

const updateOrCreateSeekerResume = async (req, res) => {
    await SeekerResume.sync();
    await Employment.sync();
    try {
        const {
            userId,
            firstName,
            middleName,
            lastName,
            email,
            contact,
            gender,
            headline,
            school,
            degree,
            study,
            studyType,
            startYear,
            endYear,
            workType,
            workLocation,
            workAvailability
        } = req.body;
        const resumeUrl = req.file.path;

        // Validate required fields
        const requiredFields = [
            "userId",
            "firstName",
            "middleName",
            "lastName",
            "email",
            "contact",
            "gender",
            "headline",
            "workType",
            "workLocation",
            "workAvailability",
            "degree",
            "study",
            "studyType",
            "startYear",
            "endYear",
            "school"

        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ msg: `${field} is required` });
            }
        }

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Check if SeekerResume exists for the user
        let seekerResume = await SeekerResume.findOne({ where: { userId: user.id } });

        // Create or update SeekerResume and Employment records
        if (!seekerResume) {
            seekerResume = await SeekerResume.create({
                userId: user.id,
                firstName,
                middleName,
                lastName,
                email,
                contact,
                gender,
                headline,
                workType,
                workLocation,
                workAvailability,
                resumeUrl,
                degree,
                school,
                study,
                studyType,
                startYear,
                endYear,
            });
        } else {
            await seekerResume.update({
                firstName,
                middleName,
                lastName,
                email,
                contact,
                gender,
                headline,
                workType,
                workLocation,
                workAvailability,
                resumeUrl,
                school,
                degree,
                study,
                studyType,
                startYear,
                endYear,
            });
        }

        // Handle Employment creation/update
        const employmentFields = ["jobTitle", "jobType", "companyName", "companyAddress", "companyCountry", "companyState", "companyCity", "dateOfJoining", "dateOfLeaving", "salary"];
        const employmentData = employmentFields.reduce((data, field) => {
            if (req.body[field]) {
                data[field] = req.body[field];
            }
            return data;
        }, {});

        let employment = await Employment.findOne({ where: { seekerResumeId: seekerResume.id } });
        if (!employment) {
            employment = await Employment.create({ ...employmentData, seekerResumeId: seekerResume.id });
        } else {
            await employment.update({ ...employmentData });
        }

        return res.status(200).json({ message: "Resume Updated Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getUserResumeDetails = async (req, res) => {
    try {
        const { userId, jobId } = req.body
        const details = [
            "userId",
            "jobId"
        ]
        for (const detail of details) {
            if (!req.body[detail]) {
                return res.status(400).json({ msg: `${detail} is required` });
            }
        }
        const userDetails = await SeekerResume.findOne({ where: { userId: userId } });
        if (!userDetails) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const getJobDetails = await JobPosting.findOne({ _id: jobId }).populate({
            path: "jobPoster",
            select: "companyName companyLogo",
        })
        if (!getJobDetails) {
            return res.status(404).json({ message: "Job Not Found" });
        }
        return res.status(200).json({ getJobDetails, userDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getMyResume = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User not found" });
        }

        const userResume = await SeekerResume.findOne({
            where: {
                userId: userId,
            },
        });
        if (!userResume) {
            return res.status(400).json({ message: "User resume does not exist" });
        }
        const employemntDetails = await Employment.findOne({
            where: {
                seekerResumeId: userResume.id,
            },
        });
        if (employemntDetails) {
            return res.status(200).json({ userResume, employemntDetails });
        }
        return res.status(200).json({ userResume });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getAResume = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '..', '..', '..', 'uploads', filename);
        res.sendFile(filePath);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    updateOrCreateSeekerResume,
    getUserResumeDetails,
    getAResume,
    getMyResume
}

