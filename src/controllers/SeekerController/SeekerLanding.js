const Job = require("../../models/Job");
const User = require("../../models/Users");
const JobPoster = require("../../models/JobPoster");

const getRecommendation = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: `User ID is required` });
        }

        // Retrieve user's interests from MySQL
        const user = await User.findByPk(userId);
        const userInterests = user && user.interest.length > 0 ? user.interest : [];
        console.log("this is user interest", user.interest)

        // Retrieve recommended courses from MongoDB based on user's interests
        let recommendedJobs = await Job.find({ department: { $in: userInterests }, status: "Pending" })
            .limit(4)
            .populate({
                path: 'jobPoster',
                select: 'companyName companyLogo' 
            });

if (recommendedJobs.length === 0) {
    recommendedJobs = await Job.aggregate([
        { $sample: { size: 10 } }, // Get random 10 jobs
        {
            $lookup: {
                from: "jobposters", // Collection name of the JobPoster schema
                localField: "jobPoster", // Field in the current collection (JobPosting) to match
                foreignField: "_id", // Field in the foreign collection (JobPoster) to match
                as: "jobPoster" // Alias for the joined documents
            }
        },
        { $unwind: "$jobPoster" },
        {
            $project: { 
                _id: 1, 
                jobTitle: 1, 
                jobType: 1,
                jobSalary: 1,
                department: 1,
                deliveryDate: 1,
                jobFormat: 1,
                // Add other fields from the Job collection you want to include
                "jobPoster.companyName": 1, 
                "jobPoster.companyLogo": 1 
            }
        }
    ]);
}

console.log("Recommended Jobs after $lookup:", recommendedJobs);
         
        // Retrieve most popular departments from MongoDB
        const mostPopularCategories = await Job.aggregate([
            { $group: { _id: "$department", totalJobs: { $sum: 1 }, averageSalary: { $avg: "$jobSalary" } } },
            { $sort: { totalJobs: -1 } },
            { $limit: 4 }
        ]);

        res.json({ recommendedJobs, mostPopularCategories });
    } catch (error) {
        console.error("Error fetching recommendation data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getRecommendation