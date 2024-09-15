const { ServiceRequest } = require("../../models/serviceRequest");

//const Service = require("../../models/Service");

const getSeekerServiceDashboardData = async (req, res) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ message: `User ID is required` });
        }

        const totalServiceRequested = await ServiceRequest.count({
            where: { userId: userId }
        });
        const newServicesRequested = await ServiceRequest.count({
            where: {
                userId: userId,
                createdAt: { $gte: currentDate }
            },
        });

        const totalCompletedServices = await ServiceRequest.count({
            where: {
                userId: userId,
                status: "completed"
            },
        });
        const pendingServiceCount = await ServiceRequest.count({
            where: {
                userId: userId,
                status: "pending"
            }
        });

        const formattedData = {
            totalServiceRequested: totalServiceRequested,
            newServicesRequested: newServicesRequested,
            totalCompletedServices: totalCompletedServices,
            pendingServiceCount: pendingServiceCount

        };

        return res.status(200).json({ formattedData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getLastFourCompletedServices = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(404).json({ message: 'User ID is required' })
        };

        const lastFourCompletedServices = await ServiceRequest.findAll({
            where: {
                userId: userId,
                status: 'completed'
            },
            order: [['createdAt', 'DESC']],
            limit: 4,
        });
        return res.status(200).json({ lastFourCompletedServices })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getAllServicesRequest = async (req, res) => {
    const userId = req.params.userId

    if (!userId) {
        return res.status(404).json({ message: 'User ID is required' })
    };

    try {

        const allServicesRequest = await ServiceRequest.findAll({
            where: {
                userId: userId,
            },
            order: [['createdAt', 'Desc']],

        });

        if (allServicesRequest.length === 0) {
            return res.status(404).json({ message: 'All services request not found' });
        }
        return res.status(200).json({ allServicesRequest })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

};

const getOngoingServiceRequest = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(404).json({ message: 'User ID is required' })
        };

        const ongoingServicesRequest = await ServiceRequest.findAll({
            where: {
                userId: userId,
                status: 'pending',
                paymentStatus: 'paid'
            },
            order: [['createdAt', 'DESC']]

        });

        if (ongoingServicesRequest.length === 0) {
            return res.status(404).json({ message: 'No ongoing paid services found' });
        }

        return res.status(200).json({ ongoingServicesRequest })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getCompletedServiceRequest = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(404).json({ message: 'User ID is required' })
        };

        const completedServicesRequest = await ServiceRequest.findAll({
            where: {
                userId: userId,
                status: 'completed',
                paymentStatus: 'paid'
            },
            order: [['createdAt', 'DESC']]
        })

        if (completedServicesRequest.length === 0) {
            return res.status(404).json({ message: 'No completed paid services found' });
        }

        return res.status(200).json({ completedServicesRequest })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    getSeekerServiceDashboardData,
    getLastFourCompletedServices,
    getAllServicesRequest,
    getOngoingServiceRequest,
    getCompletedServiceRequest
}