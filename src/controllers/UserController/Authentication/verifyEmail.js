const User = require("../../../models/Users");
const sendVerificationEmail = require("../../../utils/sendEmailVerification")


const verifyEmail = async (req, res) => {
  const { email, verificationToken, userType } = req.body;

  const details = ["verificationToken", "userType", "email"];

  for (const detail of details) {
    if (!req.body[detail]) {
      return res.status(400).json({ msg: `${detail} is required` });
    }
  }

  try {
    const user = await User.findOne({ where: { email: email, role: userType } });
    console.log('User Found:', user);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ msg: "Email has been verified" });
    }
    if (user.verificationToken !== verificationToken) {
      return res.status(400).json({ msg: "Invalid verificationToken" });
    }
    user.isVerified = true;
    user.verificationToken = "";
    await user.save();
    await sendVerificationEmail({
      username: user.username,
      email: email,
      userType: user.role,

    })
    return res.status(200).json({ msg: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = verifyEmail;
