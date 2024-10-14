const { Flags } = require("tedious/lib/collation");
const ProviderService = require("../../models/ProvidersServices");
const Rating = require("../../models/Rating");
const User = require("../../models/Users");
const SaveJob = require("../../models/saveJob");
const { ServiceRequest, OrderSummary } = require("../../models/serviceRequest");
const ServiceProvider = require("../../models/serviceprovider");
const sendServiceRequestPaymentConfirmationEmail = require("../../utils/sendServiceRequestPaymentConfirmationEmail");
const sendProviderServiceRequestEmail = require("../../utils/sendProviderServiceRequestEmail");

const requestService = async (req, res) => {

    const {
        userId,
        serviceType,
        serviceId,
        description,
        requestedPackageId,
        extraFastDelivery,
        additionalRevision,
        copyrights,
        fullName,
        companyName,
        country,
        stateRegion,
        address,
        totalPrice,
        gigQuantity
    } = req.body;


    try {
        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            console.error("User not found:", userId);
            return res.status(404).json({ error: "User not found" });
        }

        // Find the service
        const service = await ProviderService.findById(serviceId).populate('serviceProviderId');
        if (!service) {
            console.error("Service not found:", serviceId);
            return res.status(404).json({ message: "Service not found" });
        }

        // Validate email before sending
        if (!user.email) {
            console.error("User email is undefined or invalid");
            return res.status(400).json({ error: "Invalid user email" });
        }



        // Find the requested package
        const requestedPackage = service.pricing.packages.find(
            (pkg) => pkg._id == requestedPackageId
        );

        if (!requestedPackage) {
            console.error("Requested package not found:", requestedPackageId);
            return res.status(404).json({ message: "Package not found for this service" });
        }


        const currency = service.pricing.currency || 'USD';

        // Parse and validate totalPrice from request
        let basePrice = parseFloat(totalPrice);
        if (isNaN(basePrice)) {
            console.error("Invalid totalPrice from request:", totalPrice);
            basePrice = 0;
        }

        // Initialize extraCost
        let extraCost = {
            extraFastDelivery: 0,
            additionalRevision: 0,
            copyrights: 0
        };

        // Calculate extra costs
        if (extraFastDelivery === true || extraFastDelivery === "true") {
            extraCost.extraFastDelivery += requestedPackage.extraFastDelivery?.price || 0;
        } else if (extraFastDelivery === false || extraFastDelivery === "false") {
            extraCost.extraFastDelivery += 0
        }

        if (additionalRevision === true || additionalRevision === "true") {
            extraCost.additionalRevision += requestedPackage.additionalRevision?.price || 0;
        } else if (additionalRevision === false || additionalRevision === "false") {
            extraCost.additionalRevision = parseInt(0)
        }

        if (copyrights === true || copyrights === "true") {
            extraCost.copyrights += requestedPackage.copyrights?.price || 0;
        } else if (copyrights === false || copyrights === "false") {
            extraCost.copyrights += 0
        }

        // Calculate final total price
        // const finalTotalPrice = (basePrice + extraCost).toFixed(2);

        // // Check if finalTotalPrice is NaN
        // if (isNaN(finalTotalPrice)) {
        //   console.error("Final total price calculation resulted in NaN.");
        //   return res.status(400).json({ error: "Invalid total price calculation." });
        // }

        // Create new order summary
        const newOrderSummary = await OrderSummary.create({
            fullName,
            companyName,
            country,
            stateRegion,
            address,
            totalPrice,
            currency,
            serviceRequestsId: null,
        });

        // Create the service request
        const newServiceRequestData = {
            userId,
            serviceType,
            description,
            serviceId,
            currency,
            status: "ongoing",
            paymentStatus: "paid",
            requestedPackage: requestedPackageId,
            extraFastDelivery: extraCost.extraFastDelivery,
            additionalRevision: extraCost.additionalRevision,
            copyrights: extraCost.copyrights,
            gigQuantity: gigQuantity || 1,
            orderSummaryId: newOrderSummary.id,
        };


        const serviceRequest = await ServiceRequest.create(newServiceRequestData);

        // Update service provider with service request
        const serviceProviderId = service.serviceProviderId;

        // Validate serviceProviderId
        if (!serviceProviderId) {
            console.error("Service provider ID not found in the service:", service);
            return res.status(404).json({ message: "Service provider ID not found" });
        }

        const serviceProvider = await ServiceProvider.findById(serviceProviderId);

        if (!serviceProvider) {
            console.error("Service provider not found:", serviceProviderId);
            return res.status(404).json({ message: `Service provider not found: ${serviceProviderId}` });
        }

        // Update the order summary with the created serviceRequest id
        await newOrderSummary.update({ serviceRequestsId: serviceRequest.id });
        const providerFullName = `${serviceProvider.firstName} ${serviceProvider.lastName}`.trim();


        // Send email to the person requesting the service (Payment confirmation)
        await sendServiceRequestPaymentConfirmationEmail({
            fullName,
            email: user.email,
            serviceTitle: service.header,
            totalPrice,
        });

        // Send email to the service provider (Notification of the service request and payment)
        await sendProviderServiceRequestEmail({
            providerName: providerFullName,
            email: serviceProvider.emailAddress,
            serviceTitle: service.header,
            requesterName: fullName,
            totalPrice,
        });

        // Fetch the updated order summary
        const updatedOrderSummary = await OrderSummary.findByPk(newOrderSummary.id);

        res.status(201).json({
            message: "Service request sent successfully",
            serviceRequest,
            orderSummary: updatedOrderSummary,
            totalPrice: updatedOrderSummary.totalPrice,
        });
    } catch (error) {
        console.error("Error in requestService:", error);
        res.status(400).json({ error: error.message });
    }
};



const getOrderSummary = async (req, res) => {
    const userId = req.params.userId

    try {
        const serviceRequests = await ServiceRequest.findAll({
            where: { userId },
            include: [
                {
                    model: OrderSummary,
                    attributes: ['id', 'fullName', 'companyName', 'country', 'stateRegion', 'address', 'currency', 'totalPrice', 'createdAt', 'updatedAt'],
                },
            ],
        });
        const formattedResponse = serviceRequests.map((request) => {
            // Handle the case where OrderSummary might be null
            const orderSummary = request.OrderSummary
                ? {
                    id: request.OrderSummary.id,
                    fullName: request.OrderSummary.fullName,
                    companyName: request.OrderSummary.companyName,
                    country: request.OrderSummary.country,
                    stateRegion: request.OrderSummary.stateRegion,
                    address: request.OrderSummary.address,
                    currency: request.OrderSummary.currency,
                    totalPrice: request.OrderSummary.totalPrice,
                    createdAt: request.OrderSummary.createdAt,
                    updatedAt: request.OrderSummary.updatedAt,
                    serviceRequestsId: request.OrderSummary.id,
                }
                : null;

            // Calculate extra costs for the service request
            const extraCostDetails = {
                extraFastDelivery: request.extraFastDelivery ? request.extraFastDelivery : 0,
                additionalRevision: request.additionalRevision ? request.additionalRevision : 0,
                copyrights: request.copyrights ? request.copyrights : 0,
            };

            return {
                serviceHeader: request.description,
                extraFastDelivery: extraCostDetails.extraFastDelivery || false,
                additionalRevision: extraCostDetails.additionalRevision || false,
                copyrights: extraCostDetails.copyrights || false,
                gigQuantity: request.gigQuantity,
                orderSummary: orderSummary,
            };
        });

        res.status(200).json({ message: "Order Summary", data: formattedResponse });
    } catch (error) {
        console.error('Error fetching order summary:', error);
        res.status(500).json({ message: 'Server error. Could not retrieve order summary.' });
    }
}

// const updateServiceRequestStatus = async (req, res) => {
//   try {
//     const { serviceRequestId } = req.body;

//     const serviceRequest = await ServiceRequest.findByPk(serviceRequestId);

//     if (!serviceRequest) {
//       return res.status(404).json({ message: "Service request not found" });
//     }

//     serviceRequest.status = "ongoing";

//     await serviceRequest.save();

//     res.status(200).json({
//       message: "Service request status updated to Ongoing",
//       serviceRequest: serviceRequest,
//     });
//   } catch (error) {
//     console.log("Error:", error);
//     res.status(500).json({ message: "Failed to update service request status", error });
//   }
// }

const updateServiceRequestStatusCompleted = async (req, res) => {
    try {
        const { id } = req.body;


        const updatedServiceRequest = await ServiceRequest.findByPk(id);

        if (!updatedServiceRequest) {
            return res.status(404).json({ message: "Service request not found" });
        }

        updatedServiceRequest.status = "completed";

        await updatedServiceRequest.save();

        res.status(200).json({
            message: "Service request status updated to completed",
            completedServiceRequest: updatedServiceRequest,
        });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Failed to update service request status", error });
    }
}




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

        return res
            .status(200)
            .json({ message: "Service liked successfully.", updatedService });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const saveService = async (req, res) => {
    try {
        const userId = req.body.userId;
        const serviceId = req.params.serviceId;

        if (!userId || !serviceId) {
            return res
                .status(404)
                .json({ message: "userId & serviceId are required." });
        }

        const service = await ProviderService.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found." });
        }

        let savedJob = await SaveJob.findOne({ user: userId });

        if (!savedJob) {
            const newSaveJob = new SaveJob({
                user: userId,
                services: [serviceId],
            });
            await newSaveJob.save();

            return res.status(200).json({ message: "Service saved successfully." });
        } else {
            if (!savedJob.services.includes(serviceId)) {
                savedJob.services.push(serviceId);
                await savedJob.save();

                return res.status(200).json({ message: "Service saved successfully." });
            } else {
                return res.status(200).json({ message: "Service already saved." });
            }
        }
    } catch (error) {
        console.error("Error in saveService:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getSavedServices = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(404).json({ message: "userId is required." });
        }

        const savedJobs = await SaveJob.findOne({ user: userId })
            .populate({
                path: "services",
                select:
                    "header description backgroundCover likes format department status totalJobDone pricing",
            })
            .sort({ createdAt: -1 });

        if (!savedJobs || savedJobs.services.length === 0) {
            return res.status(400).json({ message: "You have no saved services." });
        }

        res
            .status(200)
            .json({ message: "Saved Services", savedServices: savedJobs.services });
    } catch (error) {
        console.error("Error in getSavedServices:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAProvidserService = async (req, res) => {
    const serviceId = req.params.serviceId;

    try {
        const service = await ProviderService.findById(serviceId).select(
            "description pricing header serviceProviderId  backgroundCover"
        );
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        const serviceProviderId = service.serviceProviderId;

        const userDetails = await ServiceProvider.findById(
            serviceProviderId
        ).select(" userImage lastName firstName skills emailAddress phoneNumber");

        let ratings = await Rating.findOne({ where: { jobId: serviceId } });
        if (!ratings) {
            ratings = "This service has no ratings";
        }

        res.status(200).json({ service, userDetails, ratings });
    } catch (error) {
        return res.status(200).json(error.message);
    }
};

const getAllServices = async (req, res) => {
    try {
        const providerServices = await ProviderService.find({}).sort({
            createdAt: -1,
        });

        const userIds = providerServices.map((service) => service.userId);

        // Fetch user details from MySQL using Sequelize
        const users = await User.findAll({
            where: { id: userIds },
            attributes: ["id", "username", "imageUrl"],
        });

        // Map and format services with user details
        const servicesWithUserDetails = providerServices.map((service) => {
            const userId =
                service.type === "service" ? service.seekerId : service.userId;
            const user = users.find((user) => user.id === userId);
            return {
                _id: service._id,
                header: service.header,
                userId: service.userId,
                description: service.description,
                serviceProviderId: service.serviceProviderId,
                backgroundCover: service.backgroundCover,
                likes: service.likes,
                format: service.format,
                department: service.department,
                status: service.status,
                totalJobDone: service.totalJobDone,
                pricing: service.pricing,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
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

const serviceByDepartment = async (req, res) => {
    const department = req.query.department;
    if (!department) {
        return res.status(400).json({ message: "Please input department" });
    }
    try {
        const providerServices = await ProviderService.find({
            department: { $regex: new RegExp(department, "i") },
        }).sort({ createdAt: -1 });

        if (providerServices.length === 0) {
            return res
                .status(404)
                .json({ message: "No services found under this department." });
        }

        res.status(200).json({
            success: true,
            services: providerServices,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const totalServicePerMonth = async (req, res) => {
    try {
        const providerServices = await ProviderService.find();

        const serviceJobsPerMonth = providerServices.reduce((acc, job) => {
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

const servicesSearch = async (req, res) => {
    try {
        const { department, format } = req.body;

        if (!Array.isArray(department) || !Array.isArray(format)) {
            return res
                .status(400)
                .json({ message: "Please provide both fields as arrays." });
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

module.exports = {
    requestService,
    getOrderSummary,
    //updateServiceRequestStatus,
    updateServiceRequestStatusCompleted,
    totalServicePerMonth,
    serviceByDepartment,
    servicesSearch,
    getAllServices,
    likeService,
    saveService,
    getSavedServices,
    getAProvidserService,
};
