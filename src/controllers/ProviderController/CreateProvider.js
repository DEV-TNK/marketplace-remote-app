// const cloudinary = require("cloudinary").v2;
const JobPosting = require("../../models/Job");
const JobPoster = require("../../models/JobPoster");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   secure: true,
// });

// const createProvider = async (req, res) => {
//   const {
//     jobPosterId,
//     firstName,
//     lastName,
//     companyEmail,
//     companyContact,
//     companyName,
//     companyWebsite,
//     companyLocation,
//     companyDesignation,
//     companyType,
//     companyDescription,
//     CompanyIndustry,
//   } = req.body;

//   const details = [
//     "jobPosterId",
//     "firstName",
//     "lastName",
//     "companyEmail",
//     "companyContact",
//     "companyName",
//     "companyLocation",
//     "companyDesignation",
//     "companyType",
//     "companyWebsite",
//     "companyDescription",
//     "CompanyIndustry",
//   ];
//   for (const detail of details) {
//     if (!req.body[detail]) {
//       return res.status(400).json({ msg: `${detail} is required` });
//     }
//   }
//   try {
//     const imageUpload = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "image",
//     });

//     const imageLink = imageUpload.secure_url;
//     // Check if the job poster already exists
//     let jobposter = await JobPoster.findOne({ jobPosterId });

//     if (jobposter) {
//       const jobposter = await JobPoster.findOneAndUpdate(
//         { jobPosterId },
//         {
//           $set: {
//             firstName,
//             lastName,
//             companyEmail,
//             companyContact,
//             companyName,
//             companyWebsite,
//             companyLocation,
//             companyType,
//             companyDesignation,
//             companyDescription,
//             CompanyIndustry,
//             companyLogo: imageLink,
//           },
//         },
//         { upsert: true, new: true }
//       );

//       return res.status(200).json({
//         message: "Job poster profile updated successfully",
//         jobposter,
//       });
//     }

//     // Create the job poster profile
//     jobposter = await JobPoster.create({
//       jobPosterId,
//       firstName,
//       lastName,
//       companyEmail,
//       companyContact,
//       companyName,
//       companyWebsite,
//       companyLocation,
//       companyType,
//       companyDesignation,
//       companyDescription,
//       CompanyIndustry,
//       companyLogo: imageLink,
//     });

//     res
//       .status(201)
//       .json({ message: "Job poster profile created successfully", jobposter });
//   } catch (error) {
//     console.error("Error creating job poster profile:", error);
//     res.status(500).json({ error: "Internal server error", error });
//   }
// };

const createProvider = async (req, res) => {
  const {
    jobPosterId,
    firstName,
    lastName,
    companyEmail,
    companyContact,
    companyName,
    companyWebsite,
    companyLocation,
    companyDesignation,
    companyType,
    companyDescription,
    CompanyIndustry,
  } = req.body;

  const details = [
    "jobPosterId",
    "firstName",
    "lastName",
    "companyEmail",
    "companyContact",
    "companyName",
    "companyLocation",
    "companyDesignation",
    "companyType",
    "companyWebsite",
    "companyDescription",
    "CompanyIndustry",
  ];

  for (const detail of details) {
    if (!req.body[detail]) {
      return res.status(400).json({ msg: `${detail} is required` });
    }
  }

  try {
    const imageFile = req.file;
    const imageLink = path.join("uploads", imageFile.filename);

    // Check if the job poster already exists
    let jobposter = await JobPoster.findOne({ jobPosterId });

    if (jobposter) {
      jobposter = await JobPoster.findOneAndUpdate(
        { jobPosterId },
        {
          $set: {
            firstName,
            lastName,
            companyEmail,
            companyContact,
            companyName,
            companyWebsite,
            companyLocation,
            companyType,
            companyDesignation,
            companyDescription,
            CompanyIndustry,
            companyLogo: imageLink,
          },
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        message: "Job poster profile updated successfully",
        jobposter,
      });
    }

    // Create the job poster profile
    jobposter = await JobPoster.create({
      jobPosterId,
      firstName,
      lastName,
      companyEmail,
      companyContact,
      companyName,
      companyWebsite,
      companyLocation,
      companyType,
      companyDesignation,
      companyDescription,
      CompanyIndustry,
      companyLogo: imageLink,
    });

    res.status(201).json({
      message: "Job poster profile created successfully",
      jobposter,
    });
  } catch (error) {
    console.error("Error creating job poster profile:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const getCompanyAboutUs = async (req, res) => {
  try {
    const jobPosterId = req.params.jobPosterId;
    if (!jobPosterId) {
      return res.status(400).json({ message: "JobPosterId is required" });
    }

    const company = await JobPoster.findOne({
      jobPosterId: jobPosterId,
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllJobsPostedByCompany = async (req, res) => {
  try {
    const jobPosterId = req.params.jobPosterId;

    if (!jobPosterId) {
      return res.status(400).json({ message: "JobPosterId is required" });
    }

    const company = await JobPoster.findOne({ jobPosterId: jobPosterId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobs = await JobPosting.find({ jobPoster: company._id })
      .populate({
        path: "jobPoster",
        select: "companyName companyLogo",
      })
      .sort({ createdAt: -1 });

    const totalJobs = jobs.length;
    res.status(200).json({ jobs, totalJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const companyDetails = async (req, res) => {
  try {
    const companies = await JobPoster.find();

    const formattedCompanies = companies.map((company) => ({
      ...company.toObject(),
      totalJobs: company.created_jobs.length,
    }));

    formattedCompanies.sort((a, b) => b.totalJobs - a.totalJobs);

    res.status(200).json({ companies: formattedCompanies });
  } catch (error) {
    console.error("Error retrieving companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const searchCompanyList = async (req, res) => {
  try {
    // Extract search parameters from the request body
    const { companyLocation, companyType, companyDesignation } = req.body;

    if (
      !companyLocation ||
      !companyType ||
      !companyDesignation ||
      !Array.isArray(companyLocation) ||
      !Array.isArray(companyType) ||
      !Array.isArray(companyDesignation)
    ) {
      return res
        .status(400)
        .json({ msg: "Please provide all the required field." });
    }

    // Construct the query based on the provided search parameters
    let query = {};

    if (companyLocation && companyLocation.length > 0) {
      query.companyLocation = { $in: companyLocation };
    }
    if (companyDesignation && companyDesignation.length > 0) {
      query.companyDesignation = { $in: companyDesignation };
    }
    if (companyType && companyType.length > 0) {
      query.companyType = { $in: companyType };
    }

    // Execute the query to find matching companies
    const companyList = await JobPoster.find(query);

    // Check if any companies match the criteria
    if (companyList.length === 0) {
      return res
        .status(404)
        .json({ message: "No companies match the criteria" });
    }

    // Iterate through each company and calculate the total number of jobs
    const mappedCompanies = await Promise.all(
      companyList.map(async (company) => {
        const totalJobs = await JobPosting.countDocuments({
          jobPoster: company._id,
        });
        return {
          _id: company._id,
          jobPosterId: company.jobPosterId,
          companyName: company.companyName,
          companyLocation: company.companyLocation,
          companyType: company.companyType,
          companyDescription: company.companyDescription,
          companyDepartment: company.companyDepartment,
          companyLocation: company.companyLocation,
          companyIndustry: company.CompanyIndustry,
          companyDesignation: company.companyDesignation,
          companyLogo: company.companyLogo,
          companyWebsite: company.companyWebsite,
          totalJobs: totalJobs,
        };
      })
    );

    // Return the list of matching companies with totalJobs included
    return res.status(200).json({ companies: mappedCompanies });
  } catch (error) {
    console.error("Error searching for companies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const companySingle = async (req, res) => {
  try {
    const jobPosterId = req.params.companyId;

    if (!jobPosterId) {
      return res.status(400).json({ message: "JobPosterId is required" });
    }

    const company = await JobPoster.findOne({
      jobPosterId: jobPosterId,
    }).select("companyName companyLogo created_jobs");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const totalJobs = company.created_jobs.length;

    // Create a new object with company details and totalJobs
    const formattedCompany = {
      CompanyId: company._id,
      CompanyName: company.companyName,
      CompanyLocation: company.companyLocation,
      companyLogo: company.companyLogo,
      totalJobs: totalJobs,
    };

    return res.status(200).json({ company: formattedCompany });
  } catch (error) {
    console.error("Error searching for companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProviderProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "JobPosterId is required" });
    }
    const company = await JobPoster.findOne({ jobPosterId: userId });
    if (!company) {
      return res.status(404).json({ message: "company does not exis" });
    }
    return res.json(company);
  } catch (error) {
    console.error("Error searching for companies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProvider,
  getCompanyAboutUs,
  getAllJobsPostedByCompany,
  companyDetails,
  searchCompanyList,
  companySingle,
  getProviderProfile,
};
