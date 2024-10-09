const ProviderService = require("../../models/ProvidersServices");
const User = require("../../models/Users");
const { ServiceRequest, OrderSummary } = require("../../models/serviceRequest");
//const { ServiceRequest, OrderSummary } = require("../../models/serviceRequest");
const ServiceProvider = require("../../models/serviceprovider");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// const onboardingServiceProvider = async (req, res) => {
//   const {
//     userId,
//     firstName,
//     lastName,
//     middleName,
//     emailAddress,
//     phoneNumber,
//     userImage,
//     title,
//     gender,
//     country,
//     language,
//     responseTime,
//     skills,
//     certification,
//     portfolio,
//   } = req.body;

//   try {

//     if (!userId || !firstName || !lastName || !emailAddress || !phoneNumber) {
//       return res.status(400).json({ message: "Required fields are missing" });
//     }

//     const providerExists = await ServiceProvider.findOne({ userId });
//     if (providerExists) {
//       return res.status(400).json({ message: "User is already a service provider" });
//     }

//     const processedCertification = [];
//     const processedPortfolio = [];

//     if (certification && certification.length > 0) {
//       certification.forEach((cert, index) => {
//         const certImage = req.certifications.find(certImage => certImage.index === index.toString())?.image || null;
//         console.log("image:", certImage.index, index)
//         processedCertification.push({
//           name: cert.name,
//           image: certImage,
//         });
//       });
//     }

//     console.log('Processed certification:', certification);
//     if (req.body.portfolio && Array.isArray(req.body.portfolio)) {
//       req.body.portfolio.forEach((port, index) => {
//         processedPortfolio.push({
//           name: port.name,
//           images: req.portfolios[index] ? req.portfolios[index].images : [],
//         });
//       });
//     }

//     const newServiceProvider = new ServiceProvider({
//       userId,
//       firstName,
//       lastName,
//       middleName,
//       emailAddress,
//       phoneNumber,
//       userImage,
//       title,
//       gender,
//       country,
//       language,
//       responseTime,
//       skills,
//       certification: processedCertification,
//       portfolio: processedPortfolio,
//     });

//     const user = await User.findOne({
//       where: {
//         id: userId
//       }
//     })

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "user does not exist" });
//     }



//     const savedServiceProvider = await newServiceProvider.save();
//     res.status(201).json({ msg: "User Onboarded Successfully", savedServiceProvider });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// }



const onboardingServiceProvider = async (req, res) => {
  const {
    userId,
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
    certification,
    portfolio,
  } = req.body;

  try {
    if (!userId || !firstName || !lastName || !emailAddress || !phoneNumber) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const providerExists = await ServiceProvider.findOne({ userId });
    if (providerExists) {
      return res.status(400).json({ message: "User is already a service provider" });
    }

    const processedCertification = [];
    const processedPortfolio = [];

    // Check if certification is an array or object
    if (certification && Array.isArray(certification)) {
      certification.forEach((cert, index) => {
        const certImage = req.certifications.find(certImage => certImage.index === index.toString())?.image || null;
        processedCertification.push({
          name: cert.name,
          image: certImage,
        });
      });
    } else if (certification && typeof certification === 'object') {
      // Handle object case
      const certImage = req.certifications.find(certImage => certImage.index === '0')?.image || null;
      processedCertification.push({
        name: certification.name,
        image: certImage,
      });
    }

    // Check if portfolio is an array
    if (portfolio && Array.isArray(portfolio)) {
      portfolio.forEach((port, index) => {
        processedPortfolio.push({
          name: port.name,
          images: req.portfolios[index] ? req.portfolios[index].images : [],
        });
      });
    } else if (portfolio && typeof portfolio === 'object') {
      // Handle object case
      processedPortfolio.push({
        name: portfolio['0'].name,
        images: portfolio['0'].images || [],
      });
    }

    const newServiceProvider = new ServiceProvider({
      userId,
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
      certification: processedCertification,
      portfolio: processedPortfolio,
    });

    const user = await User.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const savedServiceProvider = await newServiceProvider.save();
    res.status(201).json({ msg: "User Onboarded Successfully", savedServiceProvider });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


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

    const serviceProvider = await ServiceProvider.findOne({ userId });
    if (!serviceProvider) {
      return res.status(404).json({
        message: "Please onboard as a service provider to create a service",
      });
    }

    const serviceProviderId = serviceProvider._id;

    let backgroundCover = [];
    console.log("req.files:", req.files);

    if (req.files && req.files.length > 0) {
      backgroundCover = req.files.map((file) => {
        return `/uploads/images/service-background/${file.filename}`;
      });
    }

    // const parsedPricing = JSON.parse(pricing);

    const newService = new ProviderService({
      header,
      userId,
      description,
      department,
      format,
      serviceProviderId,
      backgroundCover,
      // pricing:parsedPricing,
      pricing
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getServiceRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const serviceProvider = await ServiceProvider.findOne({ userId });
    if (!serviceProvider) {
      return res
        .status(404)
        .json({ message: "User is not a service provider" });
    }

    const serviceRequestIds = serviceProvider.serviceRequests;

    if (!serviceRequestIds || serviceRequestIds.length === 0) {
      return res
        .status(404)
        .json({ message: "No service requests found for this provider" });
    }

    const requests = await ServiceRequest.findAll({
      where: {
        id: serviceRequestIds,
      },
    });

    const processedRequests = await Promise.all(
      requests.map(async (request) => {
        const service = await ProviderService.findById(request.serviceId);

        if (!service) {
          return {
            ...request.dataValues,
            packageName: "Unknown",
            packagePrice: 0,
            totalAmountPaid: 0,
          };
        }

        const requestedPackage = service.pricing.packages.find(
          (pkg) => pkg._id.toString() === request.requestedPackage.toString()
        );

        if (!requestedPackage) {
          return {
            ...request.dataValues,
            packageName: "Unknown",
            packagePrice: 0,
            totalAmountPaid: 0,
          };
        }

        let totalAmountPaid = requestedPackage.price;
        if (request.extraFastDelivery) {
          totalAmountPaid += requestedPackage.extraFastDelivery.price;
        }
        if (request.additionalRevision) {
          totalAmountPaid += requestedPackage.additionalRevision.price;
        }
        if (request.copyrights) {
          totalAmountPaid += requestedPackage.copyrights.price;
        }

        return {
          ...request.dataValues,
          packageName: requestedPackage.header,
          packagePrice: requestedPackage.price,
          totalAmountPaid,
        };
      })
    );

    res.status(200).json({ requests: processedRequests });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: error.message });
  }
};

const completeService = async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const serviceRequest = await ServiceRequest.findByPk(requestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }

    const serviceProvider = await ServiceProvider.findOne({ userId });
    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    serviceRequest.status = "completed";
    await serviceRequest.save();

    serviceProvider.serviceRequests = serviceProvider.serviceRequests.filter(
      (id) => id.toString() !== requestId.toString()
    );
    await serviceProvider.save();
    res.status(200).json({ message: "Service request completed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//To Check later
const serviceProviderDashboard = async (req, res) => {
  const userId = req.params.userId;

  try {
    const serviceProvider = await ServiceProvider.findOne({ userId });

    if (!serviceProvider) {
      return res
        .status(404)
        .json({ message: "User is not a service provider" });
    }

    const services = await ProviderService.find({ userId });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const servicesCreatedThisMonth = services.filter((service) => {
      const createdAt = new Date(service.createdAt);
      return createdAt >= startOfMonth && createdAt <= now;
    });
    const totalServicesCreatedThisMonth = servicesCreatedThisMonth.length;

    const serviceIds = services.map((service) => service._id.toString());

    const serviceRequests = await ServiceRequest.findAll({
      where: { serviceId: serviceIds },
    });

    const processedServiceRequests = await Promise.all(
      serviceRequests.map(async (request) => {
        const service = await ProviderService.findById(request.serviceId);

        if (!service) {
          return {
            ...request.dataValues,
            packageName: "Unknown",
            packagePrice: 0,
            totalAmountPaid: 0,
          };
        }


        const requestedPackage = service.pricing.packages.find(
          (pkg) => pkg._id.toString() === request.requestedPackage.toString()
        );

        if (!requestedPackage) {
          return {
            ...request.dataValues,
            packageName: "Unknown",
            packagePrice: 0,
            totalAmountPaid: 0,
          };
        }

        let totalAmountPaid = requestedPackage.price;
        if (request.extraFastDelivery) {
          totalAmountPaid += requestedPackage.extraFastDelivery.price;
        }
        if (request.additionalRevision) {
          totalAmountPaid += requestedPackage.additionalRevision.price;
        }
        if (request.copyrights) {
          totalAmountPaid += requestedPackage.copyrights.price;
        }

        return {
          ...request.dataValues,
          packageName: requestedPackage.header,
          packagePrice: requestedPackage.price,
          totalAmountPaid,
        };
      })
    );
    const ongoingRequestedServices = await ServiceRequest.findAll({
      where: {
        userId,
        status: "ongoing"
      }
    })

    const totalServicesCompleted = processedServiceRequests.filter(
      (request) => request.status === "completed"
    ).length;
    const totalServicesPending = processedServiceRequests.filter(
      (request) => request.status === "pending"
    ).length;

    const totalServicesOngoing = processedServiceRequests.filter(
      (request) => request.status === "ongoing"
    ).length;

    const totalPriceOfAllServiceRequests = processedServiceRequests.reduce(
      (total, request) => total + request.totalAmountPaid,
      0
    );

    const totalGigsEmployed = processedServiceRequests.length;

    const responseBody = {
      moneyEarned: totalPriceOfAllServiceRequests,
      totalGigCreated: services.length,
      newThisMonth: totalServicesCreatedThisMonth,
      totalCompleted: totalServicesCompleted,
      pending: totalServicesPending,
      ongoing: totalServicesOngoing,
      totalOngoingGigsEmployed: ongoingRequestedServices.length,
      totalGigsEmployed,
      servicesCreated: services,
    };

    res.status(200).json(responseBody);
  } catch (error) {
    console.error("Error fetching service provider dashboard data:", error);
    res.status(500).json({ error: error.message });
  }
};

const getMyServices = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const myServices = await ProviderService.find({ userId });
    const numberOfServices = myServices.length
    return res.status(200).json({ myServices, numberOfServices });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const myGigs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const services = await ProviderService.find({ userId });

    if (!services.length) {
      return res
        .status(404)
        .json({ message: "No services found for this user" });
    }

    const serviceIds = services.map((service) => service.id.toString());

    const serviceRequests = await ServiceRequest.findAll({
      where: { serviceId: serviceIds },

      include: [
        {
          model: OrderSummary, // Include OrderSummary in the result
          attributes: ['id', 'totalPrice'], // Fetch serviceRequestsId and totalPrice
        },
      ],

      order: [['createdAt', 'DESC']],
    });

    const processedServiceRequests = await Promise.all(
      serviceRequests.map(async (request) => {
        const service = await ProviderService.findById(request.serviceId);

        let totalAmountPaid = request.OrderSummary ? parseFloat(request.OrderSummary.totalPrice) : 0;
        const baseResponse = {
          ...request.get(),
          serviceRequestTitle: request.description,
          totalAmountPaid,
          deliveryDate: request.createdAt,
          status: request.status,
          paymentStatus: request.paymentStatus,
          username: "",
          serviceRequestId: request.id,
        };

        if (!service) {
          return baseResponse;
        }


        const user = await User.findByPk(request.userId);
        return {
          ...baseResponse,
          totalAmountPaid,
          username: user ? user.username : "",
        };
      })
    );

    const ongoingGigs = processedServiceRequests.filter(
      (request) => request.status === "ongoing"
    );
    const pendingGigs = processedServiceRequests.filter(
      (request) => request.status === "pending"
    );
    const completedGigs = processedServiceRequests.filter(
      (request) => request.status === "completed"
    );

    res.status(200).json({
      gigs: processedServiceRequests,
      ongoingGigs,
      pendingGigs,
      completedGigs,
    });
  } catch (error) {
    console.error("Error fetching completed gigs:", error);
    res.status(500).json({ error: error.message });
  }
};


const getlastFourPaidGigs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const serviceProvider = await ServiceProvider.findOne({ userId });

    if (!serviceProvider) {
      return res
        .status(404)
        .json({ message: "User is not a service provider" });
    }

    const services = await ProviderService.find({ userId });
    const serviceIds = services.map(service => service._id.toString());


    // Fetch the last four paid service requests for these services
    const paidServiceRequests = await ServiceRequest.findAll({
      where: {
        serviceId: serviceIds,
        paymentStatus: 'paid'
      },

      include: [
        {
          model: OrderSummary, // Include OrderSummary in the result
          attributes: ['id', 'totalPrice'], // Fetch OrderSummary id and totalPrice
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 4
    });

    const processedServiceRequests = await Promise.all(
      paidServiceRequests.map(async (request) => {
        const service = await ProviderService.findById(request.serviceId);

        let totalAmountPaid = request.OrderSummary ? parseFloat(request.OrderSummary.totalPrice) : 0;

        const baseResponse = {
          ...request.get(),
          serviceRequestTitle: request.description,
          totalAmountPaid,
          deliveryDate: request.createdAt,
          status: request.status,
          paymentStatus: request.paymentStatus,
          fullName: "",
          serviceRequestId: request.id

        };

        if (!service) {
          return baseResponse;
        }


        const orderSummary = await OrderSummary.findByPk(request.orderSummaryId);
        const fullName = orderSummary ? orderSummary.fullName : "";

        return {
          ...baseResponse,
          totalAmountPaid,
          fullName
        };
      })
    );
    res.status(200).json({ lastFourPaidGigs: processedServiceRequests });
  } catch (error) {
    console.error("Error fetching last four paid gigs:", error);
    res.status(500).json({ error: error.message });
  }
}

const getPortfolioImage = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', '..', '..', 'uploads', 'images', 'service-portfolio', filename);

    res.sendFile(filePath);
  } catch (error) {
    console.error(`Internal server error: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCertificateImage = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', '..', '..', 'uploads', 'images', 'service-certificates', filename);

    res.sendFile(filePath);
  } catch (error) {
    console.error(`Internal server error: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editService = async (req, res) => {
  const serviceId = req.params.serviceId;
  const updatedData = req.body;
  try {

    const updatedService = await ProviderService.findByIdAndUpdate(
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


    return res
      .status(200)
      .json({ message: "Service updated successfully", updatedService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteService = async (req, res) => {
  const serviceId = req.params.serviceId;

  try {
    const service = await ProviderService.findByIdAndDelete(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ message: "Service not found in" });
    }


    return res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};




const getGigsEmployed = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch all service requests made by the user
    const serviceRequests = await ServiceRequest.findAll({
      where: { userId },
      include: [
        {
          model: OrderSummary, // Include the related OrderSummary
          attributes: ['totalPrice'], // Only fetch totalPrice
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!serviceRequests.length) {
      return res.status(404).json({ message: "No gigs found for this user." });
    }

    // Fetch and process each service request
    const processedGigs = await Promise.all(
      serviceRequests.map(async (request) => {
        const service = await ProviderService.findById(request.serviceId);

        let totalAmountPaid = request.OrderSummary ? parseFloat(request.OrderSummary.totalPrice) : 0;
        if (!service) {
          return {
            ...request.get(),
            totalAmountPaid,
            serviceProvider: null,
            serviceDetails: null,
          };
        }

        // Fetch the service provider details from MongoDB
        const serviceProvider = await ServiceProvider.findOne({
          userId: service.userId,
        });

        if (!serviceProvider) {
          return res.status(404).json({ message: `Service provider for service ID ${service.userId} not found.` });

        }


        // Combine and return the data
        return {
          ...request.get(),
          serviceDetails: {
            header: service.header,
            description: service.description,

          },
          serviceProvider: {
            firstName: serviceProvider?.firstName || null,
            lastName: serviceProvider?.lastName || null,
          },
          totalAmountPaid,
        };
      })
    );

    // Filter gigs by status
    const ongoingGigs = processedGigs.filter((gig) => gig.status === "ongoing");
    const completedGigs = processedGigs.filter((gig) => gig.status === "completed");

    // Return all gigs, ongoing gigs, and completed gigs
    res.status(200).json({
      gigs: processedGigs,
      ongoingGigs,
      completedGigs,
    });
  } catch (error) {
    console.error("Error fetching gigs employed:", error);
    res.status(500).json({ error: error.message });
  }
}



// const getOngoingEmployedGigs = async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     const ongoingServiceRequests = await ServiceRequest.findAll({
//       where: {
//         userId,
//         status: "ongoing",
//       },

//       include: [
//         {
//           model: OrderSummary, // Include OrderSummary in the result
//           attributes: ['id', 'totalPrice'], // Fetch serviceRequestsId and totalPrice
//         },
//       ],

//       order: [['createdAt', 'DESC']],
//     });

//     if (!ongoingServiceRequests.length) {
//       return res.status(404).json({ message: "No ongoing gigs found for this provider." });
//     }

//     const processedGigs = await Promise.all(
//       ongoingServiceRequests.map(async (request) => {
//         const service = await ProviderService.findById(request.serviceId);

//         let totalAmountPaid = request.OrderSummary ? parseFloat(request.OrderSummary.totalPrice) : 0;

//         const baseResponse = {
//           ...request.get(),
//           serviceRequestTitle: request.description,
//           totalAmountPaid,
//           deliveryDate: request.createdAt,
//           status: request.status,
//           paymentStatus: request.paymentStatus,
//           username: "",
//           serviceRequestId: request.id
//         };

//         if (!service) {
//           return baseResponse;
//         }

//         //     const requestedPackage = service.pricing.packages.find(
//         //       (pkg) => pkg._id.toString() === request.requestedPackage.toString()
//         //     );

//         //     if (!requestedPackage) {
//         //       return baseResponse
//         //     }

//         //     let salary = requestedPackage.price;
//         //     if (request.extraFastDelivery) {
//         //       salary += requestedPackage.extraFastDelivery.price;
//         //     }
//         //     if (request.additionalRevision) {
//         //       salary += requestedPackage.additionalRevision.price;
//         //     }
//         //     if (request.copyrights) {
//         //       salary += requestedPackage.copyrights.price;
//         //     }

//         //     return baseResponse
//       })
//     );

//     res.status(200).json({
//       ongoingGigs: processedGigs,
//     });
//   } catch (error) {
//     console.error("Error fetching ongoing gigs:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const getOngoingEmployedGigs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const ongoingServiceRequests = await ServiceRequest.findAll({
      where: {
        userId,
        status: "ongoing",
      },

      include: [
        {
          model: OrderSummary, // Include OrderSummary in the result
          attributes: ['id', 'totalPrice'], // Fetch OrderSummary id and totalPrice
        },
      ],

      order: [['createdAt', 'DESC']],
    });

    if (!ongoingServiceRequests.length) {
      return res.status(404).json({ message: "No ongoing gigs found for this provider." });
    }

    const processedGigs = await Promise.all(
      ongoingServiceRequests.map(async (request) => {
        try {
          const service = await ProviderService.findById(request.serviceId);

          // Calculate totalAmountPaid from OrderSummary
          let totalAmountPaid = request.OrderSummary ? parseFloat(request.OrderSummary.totalPrice) : 0;

          // Base response structure
          const baseResponse = {
            ...request.get(),
            serviceRequestTitle: request.description,
            totalAmountPaid,
            deliveryDate: request.createdAt,
            status: request.status,
            paymentStatus: request.paymentStatus,
            username: "",
            serviceRequestId: request.id // Use the correct ServiceRequest ID
          };

          // If the service is not found, return the base response
          if (!service) {
            return baseResponse;
          }

          // Otherwise, process and return the full response
          const user = await User.findByPk(request.userId);
          return {
            ...baseResponse,
            username: user ? user.username : "",
          };
        } catch (error) {
          console.error("Error processing a service request:", error);
          return null; // Handle errors and return null if something goes wrong for a particular request
        }
      })
    );

    // Filter out null values from processed gigs
    const validGigs = processedGigs.filter((gig) => gig !== null);

    res.status(200).json({
      ongoingGigs: validGigs,
    });
  } catch (error) {
    console.error("Error fetching ongoing gigs:", error);
    res.status(500).json({ error: error.message });
  }
};



// const getCompletedEmployedGigs = async (req, res) => {

//   const userId = req.params.userId;

//   try {
//     const completedServiceRequests = await ServiceRequest.findAll({
//       where: {
//         userId,
//         status: "completed",
//       },
//       include: [
//         {
//           model: OrderSummary, // Include OrderSummary in the result
//           attributes: ['id', 'totalPrice'], // Fetch serviceRequestsId and totalPrice
//         },
//       ],

//       order: [['createdAt', 'DESC']],
//     });

//     if (!completedServiceRequests.length) {
//       return res.status(404).json({ message: "No completed gigs found for this provider." });
//     }

//     const processedGigs = await Promise.all(
//       completedServiceRequests.map(async (request) => {
//         const service = await ProviderService.findById(request.serviceId);
//         let totalAmountPaid = request.OrderSummary ? parseFloat(request.OrderSummary.totalPrice) : 0;

//         const baseResponse = {
//           ...request.get(),
//           serviceRequestTitle: request.description,
//           totalAmountPaid,
//           deliveryDate: request.createdAt,
//           status: request.status,
//           paymentStatus: request.paymentStatus,
//           username: "",
//           serviceRequestId: request.id
//         };

//         if (!service) {
//           return baseResponse;
//         }

//         // const requestedPackage = service.pricing.packages.find(
//         //   (pkg) => pkg._id.toString() === request.requestedPackage.toString()
//         // );

//         // if (!requestedPackage) {
//         //   return baseResponse
//         // }

//         // let salary = requestedPackage.price;
//         // if (request.extraFastDelivery) {
//         //   salary += requestedPackage.extraFastDelivery.price;
//         // }
//         // if (request.additionalRevision) {
//         //   salary += requestedPackage.additionalRevision.price;
//         // }
//         // if (request.copyrights) {
//         //   salary += requestedPackage.copyrights.price;
//         // }

//         // return baseResponse
//       })
//     );

//     res.status(200).json({
//       completedGigs: processedGigs,
//     });
//   } catch (error) {
//     console.error("Error fetching completed gigs:", error);
//     res.status(500).json({ error: error.message });
//   }

// };



const getCompletedEmployedGigs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const ongoingServiceRequests = await ServiceRequest.findAll({
      where: {
        userId,
        status: "completed",
      },

      include: [
        {
          model: OrderSummary, // Include OrderSummary in the result
          attributes: ['id', 'totalPrice'], // Fetch OrderSummary id and totalPrice
        },
      ],

      order: [['createdAt', 'DESC']],
    });

    if (!ongoingServiceRequests.length) {
      return res.status(404).json({ message: "No ongoing gigs found for this provider." });
    }

    const processedGigs = await Promise.all(
      ongoingServiceRequests.map(async (request) => {
        try {
          const service = await ProviderService.findById(request.serviceId);

          // Calculate totalAmountPaid from OrderSummary
          let totalAmountPaid = request.OrderSummary ? parseFloat(request.OrderSummary.totalPrice) : 0;

          // Base response structure
          const baseResponse = {
            ...request.get(),
            serviceRequestTitle: request.description,
            totalAmountPaid,
            deliveryDate: request.createdAt,
            status: request.status,
            paymentStatus: request.paymentStatus,
            username: "",
            serviceRequestId: request.id // Use the correct ServiceRequest ID
          };

          // If the service is not found, return the base response
          if (!service) {
            return baseResponse;
          }

          // Otherwise, process and return the full response
          const user = await User.findByPk(request.userId);
          return {
            ...baseResponse,
            username: user ? user.username : "",
          };
        } catch (error) {
          console.error("Error processing a service request:", error);
          return null; // Handle errors and return null if something goes wrong for a particular request
        }
      })
    );

    // Filter out null values from processed gigs
    const validGigs = processedGigs.filter((gig) => gig !== null);

    res.status(200).json({
      completedGigs: validGigs,
    });
  } catch (error) {
    console.error("Error fetching ongoing gigs:", error);
    res.status(500).json({ error: error.message });
  }
};


const getServicesCreatedPerMonth = async (req, res) => {
  const userId = Number(req.params.userId);
  try {
    const serviceProvider = await ServiceProvider.findOne({ userId });

    if (!serviceProvider) {
      return res.status(404).json({ message: "User is not a service provider" });
    }
    // Aggregate services created per month
    const servicesPerMonth = await ProviderService.aggregate([
      {
        $match: { userId } // Match services created by this provider
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          count: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Map the month number to the month name
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const result = months.map((month, index) => {
      const found = servicesPerMonth.find((item) => item.month === index + 1);
      return {
        month,
        data: found ? found.count : 0,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching service data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  onboardingServiceProvider,
  getMyServices,
  editService,
  deleteService,
  providerCreateService,
  getServiceRequests,
  completeService,
  serviceProviderDashboard,
  myGigs,
  getlastFourPaidGigs,
  getCertificateImage,
  getPortfolioImage,
  getGigsEmployed,
  getOngoingEmployedGigs,
  getCompletedEmployedGigs,
  getServicesCreatedPerMonth,
};
