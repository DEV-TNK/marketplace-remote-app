const User = require("../../models/Users");
const ServiceProvider = require("../../models/serviceprovider");
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   secure: true,
// });

const onboardingServiceProvider = async (req, res) => {
  const {
    serviceProviderId,
    firstName,
    lastName,
    middleName,
    emailAddress,
    phoneNumber,
    title,
    gender,
    country,
    language,
    responseTime,
    skills,
    certificationName,
    portfolioName,
  } = req.body;

  try {
    if (
      !serviceProviderId ||
      !firstName ||
      !lastName ||
      !emailAddress ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if user exists
    const user = await User.findByPk(serviceProviderId); // Adjust this to match your database setup
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle user image
    let userImage = "";
    if (req.files["userImage"]) {
      userImage = req.files["userImage"][0].path;
    }

    // Handle portfolio images
    let portfolioBody = {};
    if (portfolioName) {
      portfolioBody.name = portfolioName;
    }

    if (
      req.files["portfolioImages"] &&
      req.files["portfolioImages"].length > 0
    ) {
      portfolioBody.images = req.files["portfolioImages"].map(
        (file) => file.path
      );
    } else {
      console.log("Portfolio images are not provided correctly");
    }

    // Handle certification image
    let certificationBody = {};
    if (certificationName && req.files["certificationImage"]) {
      certificationBody = {
        name: certificationName,
        image: req.files["certificationImage"][0].path,
      };
    } else {
      console.log("Certification image is not provided correctly");
    }

    // Create new service provider
    const newServiceProvider = new ServiceProvider({
      serviceProviderId,
      firstName,
      lastName,
      middleName,
      emailAddress,
      phoneNumber,
      userImage,
      title,
      gender,
      country,
      language,
      responseTime,
      skills,
      certification: [certificationBody],
      portfolio: [portfolioBody],
    });

    // Save the service provider
    const savedServiceProvider = await newServiceProvider.save();
    res.status(201).json(savedServiceProvider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { onboardingServiceProvider };
