const User = require("../../../models/Users");

const saveInterest = async (req, res) => {
  try {
    const { interests } = req.body;
    if (!interests && !Array.isArray(interests) && interests.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide selected field." });
    }

    const userId = req.params.id;
    if (!userId) {
      return res.status(404).json({ message: "Provide user id" });
    }
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const interestStringified = JSON.stringify(interests)
    // Update user's interests
    await user.update({ interest: interestStringified });

    res.status(200).json({ message: "Interests saved successfully", user });
  } catch (error) { }
};

module.exports = saveInterest;
