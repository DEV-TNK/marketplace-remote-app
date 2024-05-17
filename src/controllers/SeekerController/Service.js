const Service = require("../../models/Service");
const User = require("../../models/Users");
const { SeekerResume } = require("../../models/SeekerResume");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

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
      currency
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
    return res.status(200).json({ myServices });
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
    const service = await Service.findById(serviceId);
    const user = await User.findOne({
      where: {
        id: service.seekerId,
      },
    });
    console.log("here is working well");
    const seekerCv = await SeekerResume.findOne({ where: { userId: user.id } });
    const userDetails = {
      firstName: seekerCv.firstName,
      lastName: seekerCv.lastName,
      userImage: user.imageUrl,
      email: user.email,
      contact: seekerCv.contact,
    };
    return res.status(200).json({ service, userDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    const userIds = services.map((service) => service.seekerId);

    // Fetch user details from MySQL using Sequelize
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "username", "imageUrl"],
    });

    // Map user details to services
    const servicesWithUserDetails = services.map((service) => {
      const user = users.find((user) => user.id === service.seekerId);
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
const servicesSearch = async (req, res) => {
  try {
    const { department, priceFormat, type } = req.body;

    if (
      !Array.isArray(department) ||
      !Array.isArray(priceFormat) ||
      !Array.isArray(type)
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all three fields as arrays." });
    }

    let query = {};

    if (department && department.length > 0) {
      query.department = { $in: department.map((dep) => new RegExp(dep, "i")) };
    }
    if (priceFormat && priceFormat.length > 0) {
      query.jobSalaryFormat = {
        $in: priceFormat.map((format) => new RegExp(format, "i")),
      };
    }
    if (type && type.length > 0) {
      query.serviceType = { $in: type.map((typ) => new RegExp(typ, "i")) };
    }
    console.log("this is search criteria", query);

    // Query the database for services matching the search criteria
    const serviceSearch = await Service.find(query).sort({
      createdAt: -1,
    });
    console.log("service", serviceSearch);

    const userIds = serviceSearch.map((service) => service.seekerId);
    console.log("this is user", userIds);

    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "username", "imageUrl"],
    });

    const servicesWithUserDetails = serviceSearch.map((service) => {
      const user = users.find((user) => user.id === service.seekerId);
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
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteSeekerService = async (req, res) => {
  const serviceId = req.params.serviceId;

  try {
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Seeker service not found." });
    }
    return res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

const serviceByDepartment = async (req, res) => {
  console.log("URL :", req.url);
  console.log(" req.query.department:", req.query.department);
  //Get department from query
  const department = req.query.department;
  if (!department) {
    return res.status(400).json({ message: "Please input department" });
  }
  try {
    //Find sevice (regex for stronger searching )
    const services = await Service.find({
      department: { $regex: new RegExp(department, "i") },
    }).sort({ createdAt: -1 });

    if (services.length === 0) {
      return res
        .status(404)
        .json({ message: "No sevices found under this department." });
    }
    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
};
