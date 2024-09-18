const { SeekerEarning, PaymentRequest } = require("../../models/SeekerPaymentRecords");


const getSeekerEarning = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ message: `User ID is required` });
        }
        const userEarning = await SeekerEarning.findOne({
            where: {
                userId: userId
            }
        });

        if (!userEarning) {
            return res.status(404).json({ message: "Earnings not found for this user" })
        }
        return res.status(200).json({
            NGN: userEarning.NGN,
            USD: userEarning.USD,
            GBP: userEarning.GBP,
            EUR: userEarning.EUR

        });
    } catch (error) {
        console.error('Error fetching jobs for job seeker:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const getAllSeekerPaymentRequest = async (req, res) => {
    try {
        const userId = req.params.userId
        const history = await PaymentRequest.findAll({
            where: {
                userId: userId,

            },
            order: [["requestDate", "DESC"]],

        });
        return res.status(200).json({ history });

    } catch (error) {
        console.error('Error fetching jobs for job seeker:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getSeekerEarning, getAllSeekerPaymentRequest }
