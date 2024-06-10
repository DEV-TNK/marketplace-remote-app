const Service = require("../../models/Service");
const User = require("../../models/Users");
const { SeekerResume } = require("../../models/SeekerResume");
const ProviderService = require("../../models/ProvidersServices");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const providerCreateService = async (req, res) => {
  try {
    const { header, description, department, format, pricing, userId } =
      req.body;

    const details = [
      "header",
      "userId",
      "description",
      "department",
      "format",
      "pricing",
    ];
    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ msg: `${detail} is required` });
      }
    }

    let backgroundCover = [];
    // console.log("req.files:", req.files);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      backgroundCover.push(result.secure_url);
    }

    if (req.files) {
      backgroundCover = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    const parsedPricing = JSON.parse(pricing);

    const newService = new ProviderService({
      header,
      userId,
      description,
      department,
      format,
      backgroundCover,
      pricing: parsedPricing,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const {
      serviceHeading,
      serviceName,
      seekerId,
      description,
      serviceUrl,
      experience,
      benefit,
      department,
      serviceType,
      status,
      jobSalaryFormat,
      price,
      currency,
    } = req.body;

    const details = [
      "serviceName",
      "seekerId",
      "description",
      "serviceUrl",
      "experience",
      "benefit",
      "department",
      "serviceType",
      "status",
      "jobSalaryFormat",
      "price",
      "currency",
    ];
    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ msg: `${detail} is required` });
      }
    }
    const serviceData = JSON.parse(serviceUrl);
    const benefitData = JSON.parse(benefit);
    if (
      !serviceData ||
      !benefitData ||
      !Array.isArray(benefitData) ||
      benefitData.length === 0 ||
      !Array.isArray(serviceData) ||
      serviceData.length === 0
    ) {
      return res.status(400).json({
        message: "Please send service url, and benefite as array.",
      });
    }
    const user = await User.findByPk(seekerId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });
    const imageLink = imageUpload.secure_url;

    const myService = await Service.create({
      serviceHeading,
      serviceName,
      seekerId,
      description,
      serviceUrl: serviceData,
      experience,
      benefit: benefitData,
      department,
      serviceType,
      status,
      image: imageLink,
      jobSalaryFormat,
      price,
      currency,
    });
    return res
      .status(200)
      .json({ message: "Service Created Suucessfully", myService });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMyServices = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const myServices = await Service.find({ seekerId: userId }).sort({
      createdAt: -1,
    });
    const serviceProviderServices = await ProviderService.find({ userId });

    return res.status(200).json({ myServices, serviceProviderServices });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    let service = await Service.findById(serviceId);
    let userId;

    if (!service) {
      service = await ProviderService.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      userId = service.userId;
    } else {
      userId = service.seekerId;
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const seekerCv = await SeekerResume.findOne({ where: { userId: user.id } });
    if (!seekerCv) {
      return res.status(404).json({ message: "Seeker resume not found" });
    }

    const userDetails = {
      firstName: seekerCv.firstName,
      lastName: seekerCv.lastName,
      userImage: user.imageUrl,
      email: user.email,
      contact: seekerCv.contact,
    };
    return res.status(200).json({ service, userDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllServices = async (req, res) => {
  try {
    // Fetch services from both Service and ProviderService models
    const services = await Service.find({}).sort({ createdAt: -1 });
    const providerServices = await ProviderService.find({}).sort({
      createdAt: -1,
    });

    // Combine services and provider services
    const allServices = [
      ...services.map((service) => ({
        ...service.toObject(),
        type: "service",
      })),
      ...providerServices.map((service) => ({
        ...service.toObject(),
        type: "providerService",
      })),
    ];

    const userIds = [
      ...services.map((service) => service.seekerId),
      ...providerServices.map((service) => service.userId),
    ];

    // Fetch user details from MySQL using Sequelize
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "username", "imageUrl"],
    });

    // Map user details to services
    const servicesWithUserDetails = allServices.map((service) => {
      const userId =
        service.type === "service" ? service.seekerId : service.userId;
      const user = users.find((user) => user.id === userId);
      return {
        ...service,
        user: user
          ? { id: user.id, name: user.username, image: user.imageUrl }
          : null,
      };
    });

    return res.status(200).json(servicesWithUserDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//department format
const servicesSearch = async (req, res) => {
  try {
    const { department, format } = req.body;

    if (!Array.isArray(department) || !Array.isArray(format)) {
      return res
        .status(400)
        .json({ message: "Please provide all three fields as arrays." });
    }

    let query = {};

    if (department && department.length > 0) {
      query.department = { $in: department.map((dep) => new RegExp(dep, "i")) };
    }
    if (format && format.length > 0) {
      query.format = {
        $in: format.map((format) => new RegExp(format, "i")),
      };
    }
    console.log("this is search criteria", query);

    // Query the database for services matching the search criteria
    const serviceSearch = await ProviderService.find(query).sort({
      createdAt: -1,
    });
    console.log("service", serviceSearch);

    const userIds = serviceSearch.map((service) => service.userId);
    console.log("this is user", userIds);

    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "username", "imageUrl"],
    });

    const servicesWithUserDetails = serviceSearch.map((service) => {
      const user = users.find((user) => user.id === service.userId);
      return {
        ...service.toObject(),
        user: user
          ? { id: user.id, name: user.username, image: user.imageUrl }
          : null,
      };
    });

    return res.status(200).json(servicesWithUserDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editSeekerServices = async (req, res) => {
  const serviceId = req.params.serviceId;
  const updatedData = req.body;
  try {
    let updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService) {
      updatedService = await ProviderService.findByIdAndUpdate(
        serviceId,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      };
      // Handle backgroundCover if provided
      if (req.files) {
       
        const backgroundCoverUrls = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          backgroundCoverUrls.push(result.secure_url);
        }
        updatedService.backgroundCover = backgroundCoverUrls;
        await updatedService.save();
      }
    }

    return res
      .status(200)
      .json({ message: "Service updated successfully", updatedService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteSeekerService = async (req, res) => {
  const serviceId = req.params.serviceId;

  try {
    let service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
      service = await ProviderService.findByIdAndDelete(serviceId);
      if (!service) {
        return res
          .status(404)
          .json({ message: "Service not found in both models." });
      }
    }

    return res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const serviceByDepartment = async (req, res) => {
  const department = req.query.department;
  if (!department) {
    return res.status(400).json({ message: "Please input department" });
  }
  try {
    // Find services in both Service and ProviderService models
    const services = await Service.find({
      department: { $regex: new RegExp(department, "i") },
    }).sort({ createdAt: -1 });

    const providerServices = await ProviderService.find({
      department: { $regex: new RegExp(department, "i") },
    }).sort({ createdAt: -1 });

    // Merge results from both collections
    const allServices = [...services, ...providerServices];

    if (allServices.length === 0) {
      return res
        .status(404)
        .json({ message: "No services found under this department." });
    }

    res.status(200).json({
      success: true,
      services: allServices,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const totalServicePerMonth = async (req, res) => {
  try {
    const serviceJobs = await Service.find();
    const providerServiceJobs = await ProviderService.find();

    const allServiceJobs = [...serviceJobs, ...providerServiceJobs];

    const serviceJobsPerMonth = allServiceJobs.reduce((acc, job) => {
      const jobDate = new Date(job.createdAt);
      const monthName = jobDate.toLocaleString("default", { month: "long" });
      acc[monthName] = (acc[monthName] || 0) + 1;
      return acc;
    }, {});

    const allMonths = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(0, index);
      return date.toLocaleString("default", { month: "long" });
    });

    const allJobsPerMonths = allMonths.map((month) => ({
      month,
      totalJobs: serviceJobsPerMonth[month] || 0,
    }));

    res.json(allJobsPerMonths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserDetails = async (seekerId) => {
  try {
    const user = await User.findByPk(seekerId);
    if (user) {
      return {
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

const getFgnAlatRecommendedServices = async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    // Fetch user interests
    const userInterests =
      user.interest && user.interest.length > 0 ? user.interest : [];

    // Fetch recommended services from MongoDB
    let recommendedServices = [];
    if (userInterests.length > 0) {
      recommendedServices = await Service.find({
        department: { $in: userInterests },
      })
        .limit(10)
        .exec();
    }

    // Fetch random services if no recommendations found based on interests
    if (recommendedServices.length === 0) {
      recommendedServices = await Service.aggregate([
        { $sample: { size: 10 } },
        {
          $project: {
            _id: 1,
            serviceHeading: 1,
            serviceName: 1,
            seekerId: 1,
            description: 1,
            serviceUrl: 1,
            image: 1,
            currency: 1,
            experience: 1,
            benefit: 1,
            department: 1,
            serviceType: 1,
            serviceLogo: 1,
            status: 1,
            totalJobDone: 1,
            jobSalaryFormat: 1,
            price: 1,
          },
        },
      ]);
    }

    // Combine user details with service details
    const servicesWithUserDetails = await Promise.all(
      recommendedServices.map(async (service) => {
        // Retrieve user details based on seekerId
        const userDetails = await getUserDetails(service.seekerId);
        if (!userDetails) {
          return service; // Return service as is if no user details found
        }
        const serviceData = service.toObject ? service.toObject() : service;
        return {
          ...serviceData,
          user: userDetails,
        };
      })
    );

    res.status(200).json({ recommendedServices: servicesWithUserDetails });
  } catch (error) {
    console.error("Error fetching recommendation data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const likeService = async (req, res) => {
  const serviceId = req.body.serviceId;

  try {
    
    const updatedService = await ProviderService.findByIdAndUpdate(
      serviceId,
      { $inc: { likes: 1 } },
      { new: true } 
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    return res.status(200).json({ message: "Service liked successfully.", updatedService });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


module.exports = {
  createService,
  getMyServices,
  getAService,
  getAllServices,
  servicesSearch,
  editSeekerServices,
  deleteSeekerService,
  serviceByDepartment,
  totalServicePerMonth,
  getFgnAlatRecommendedServices,
  providerCreateService,
  likeService
};
