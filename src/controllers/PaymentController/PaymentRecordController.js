const JobPosting = require("../../models/Job");
const { SeekerPaymentRecord } = require("../../models/SeekerPaymentRecords");


const User = require("../../models/Users")

const savePaymentRecord = async (req, res) => {
    await SeekerPaymentRecord.sync();
    const { userId, accountId, amount, adminId } = req.body;
    const details = ["userId", "accountId", "amount", "adminId"];
    // Check if userId is provided
    for (const detail of details) {
        if (!req.body[detail]) {
            return res.status(400).json({ message: `${detail} is required` });
        }
    }
    try {
        const newPaymentRecord = await SeekerPaymentRecord.create({
            userId,
            accountId,
            amount,
            adminId
        });
        res
            .status(201)
            .json({ message: "Payment record saved successfully", newPaymentRecord });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error saving payment record", error: error.message });
    }
};
const getPaymentRecords = async (req, res) => {
    try {
        // Find all payment records, ordered by payment date in descending order
        const paymentRecords = await SeekerPaymentRecord.findAll({
            order: [['requestDate', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'username', 'imageUrl'] }
            ]
        });
        res.status(200).json(paymentRecords);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error fetching payment records",
            error: error.message,
        });
    }
};

module.exports = { savePaymentRecord, getPaymentRecords };
