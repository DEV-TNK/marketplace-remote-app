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

    // console.log("req.files:", req.files);
    // console.log("req.body:", req.body);

    // Check if user exists
    const user = await User.findByPk(serviceProviderId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload user image to Cloudinary
    let userImage = "";
    if (req.files["userImage"]) {
      const imageUpload = await cloudinary.uploader.upload(
        req.files["userImage"][0].path,
        {
          resource_type: "image",
        }
      );
      userImage = imageUpload.secure_url;
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
      try {
        const images = await Promise.all(
          req.files["portfolioImages"].map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
              resource_type: "image",
            });
            return result.secure_url;
          })
        );

        portfolioBody.images = images;
      } catch (error) {
        console.error("Portfolio image upload failed:", error);
      }
    } else {
      console.log("Portfolio images are not provided correctly");
    }

    // Handle certification image
    let certificationBody = {};
    if (certificationName && req.files["certificationImage"]) {
      try {
        const result = await cloudinary.uploader.upload(
          req.files["certificationImage"][0].path,
          {
            resource_type: "image",
          }
        );

        certificationBody = {
          name: certificationName,
          image: result.secure_url,
        };
      } catch (error) {
        console.error("Certification image upload failed:", error);
      }
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
