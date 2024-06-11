const Account = require("../../models/Accounts");
const User = require("../../models/Users");

const saveJobSeekerAccount = async (req, res) => {
    await Account.sync();
    const { userId, accountName, accountNumber, bankName, currency } = req.body;
    const details = ["userId", "accountName", "accountNumber", "bankName", "currency"];
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
         const newAccount = await Account.create({
                userId,
                accountName,
                accountNumber,
                bankName,
                currency
            });
            return res.status(201).json({ message: "Bank details saved successfully", newAccount });
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

const editAccountDetails = async (req, res) => {
    try {
        const { accountId, userId, accountName, accountNumber, bankName } = req.body;
        const details = ["userId", "accountId"];

        for (const detail of details) {
            if (!req.body[detail]) {
                return res.status(400).json({ message: `${detail} is required` });
            }
        }

        const account = await Account.findOne({ where: { id: accountId, userId: userId } });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Prepare the update object
        const updateObject = {};

        // Add accountNumber and bankName to the updateObject if provided
        if(accountName !== undefined){
            updateObject.accountName= accountName
        }
        if (accountNumber !== undefined) {
            updateObject.accountNumber = accountNumber;
        }
        if (bankName !== undefined) {
            updateObject.bankName = bankName;
        }

        // Update the account details
        await account.update(updateObject);

        res.status(200).json({ message: 'Account updated successfully' });
    } catch (error) {
        console.error("Error editing account:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { saveJobSeekerAccount, getUserBankDetails,editAccountDetails };
