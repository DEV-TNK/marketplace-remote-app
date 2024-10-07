const Users = require('../models/Users');


const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' });
        }
        const user = await Users.find({ _id: userId, role: "admin" })
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist or is not an admin' });
        }
        next();
    } catch (error) {
        console.error('Error creating questions:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

module.exports = verifyAdmin