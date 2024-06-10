const { SeekerEarning, PaymentRequest } = require("../../models/SeekerPaymentRecords");


const getSeekerEarning = async (req, res) => {
    try {
        const userId = req.params.userId
        const earning = await SeekerEarning.findOne({ where: { userId: userId } });
        let userEarning;
        if (earning) {
            userEarning = earning
        } else {
            userEarning = "0"
        }
        return res.status(200).json({ userEarning });
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
