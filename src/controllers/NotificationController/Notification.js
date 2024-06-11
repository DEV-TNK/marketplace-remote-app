const Notification = require("../../models/Notification");

const sendPaymentNotification = async (req, res) => {
    try {
        const {
            userId, jobId, type, description
        } = req.body;

        const details = [
            "userId",
            "type",
            "description",
        ];
        for (const detail of details) {
            if (!req.body[detail]) {
                return res.status(400).json({ msg: `${detail} is required` });
            }
        }

        const paymentNotification = new Notification({
            userId,
            jobId,
            type,
            description,
        });

        await paymentNotification.save();
        res.status(201).json({ message: 'Payment notification created successfully', notification: paymentNotification });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error })
    }
}

const sendMarkJobCompletionNotification = async (req, res) => {
    try {
        const { userId, jobId } = req.body;

        if (!userId || !jobId) {
            return res.status(400).json({ message: 'User ID and Job ID are required.' });
        }

        const newNotification = new Notification({
            userId,
            jobId,
            type: 'success',
            description: 'Your job completion has been marked as successful.',
        });
        await newNotification.save();

        res.status(201).json({ message: 'Job completion notification sent successfully', notification: newNotification });
    } catch (error) {

    }
}

module.exports = { sendPaymentNotification, sendMarkJobCompletionNotification }