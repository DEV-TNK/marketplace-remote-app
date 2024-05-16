const Job = require("../../models/Job");
const JobPoster = require("../../models/JobPoster");

const getTopCompaniesHiring = async (req, res) => {
    try {
        const topCompanies = await JobPoster.aggregate([
            {
                $lookup: {
                    from: "jobpostings",
                    localField: "created_jobs",
                    foreignField: "_id",
                    as: "jobs"
                }
            },
            {
                $project: {
                    companyName: 1,
                    companyLogo: 1,
                    CompanyIndustry: 1,
                    jobCount: { $size: "$jobs" }
                }
            },
            {
                $sort: { jobCount: -1 } // Sort by jobCount in descending order
            },
            {
                $limit: 4 // Limit to the top 4 companies
            }
        ]);


        //const topCompanies = await JobPoster.find().limit(4).populate("companyName companyLogo")
        res.json(topCompanies)
        //console.log("Top Companies:", topCompanies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = getTopCompaniesHiring