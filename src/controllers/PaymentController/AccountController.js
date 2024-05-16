const Account = require("../../models/Accounts");
const User = require("../../models/Users");

const saveJobSeekerAccount = async (req, res) => {
    await Account.sync();
    const { userId, accountName, accountNumber, bankName } = req.body;
    const details = ["userId", "accountName", "accountNumber", "bankName"];
    // Check if userId is provided
    for (const detail of details) {
        if (!req.body[detail]) {
            return res.status(400).json({ message: `${detail} is required` });
        }
    }
    try {
        // Find the user by ID to ensure they exist
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user already has a bank record
        let existingAccount = await Account.findOne({ where: { userId } });

        if (existingAccount) {
            existingAccount.accountName = accountName;
            existingAccount.accountNumber = accountNumber;
            existingAccount.bankName = bankName;
            await existingAccount.save();
            return res.status(200).json({ message: "Bank details updated successfully", existingAccount });
        } else {
            const newAccount = await Account.create({
                userId,
                accountName,
                accountNumber,
                bankName,
            });
            return res.status(201).json({ message: "Bank details saved successfully", newAccount });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error saving bank details", error: error.message });
    }
};


const getUserBankDetails = async (req, res) => {
    try {
        const userId = req.params.userId;
        const accountDetails = await Account.findAll({ where: { userId } });

        res.status(200).json({ accountDetails });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Error retrieving bank details", error: error.message });
    }
};
module.exports = { saveJobSeekerAccount, getUserBankDetails };
