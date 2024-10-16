const User = require("../../../models/Users");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendVerificationEmail = require("../../../utils/sendEmailVerification");

const Register = async (req, res) => {
  try {
    await User.sync();

    const { username, email, password, userType } = req.body;
    const details = ["username", "userType", "email", "password"];

    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ msg: `${detail} is required` });
      }
    }
    const duplicateUser = await User.findOne({
      where: {
        email: email,
        role: userType,
      },
    });

    if (duplicateUser) {
      // if the emailis not verify, update the user account
      if (!duplicateUser.isVerify) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(40).toString("hex");

        // Update user information using the instance method 'update'
        const updateUser = await duplicateUser.update({
          username,
          password: hashedPassword,
          role: userType,
          verificationToken,
        });

        // Send verification email
        await sendVerificationEmail({
          username: updateUser.username,
          email: updateUser.email,
          verificationToken: updateUser.verificationToken,
          userType: updateUser.role,
          origin: process.env.ORIGIN,
        });

        return res
          .status(201)
          .json({ message: "Verification email resent successfully" });
      } else {
        return res
          .status(409)
          .json({ message: "Email address is associated with an account" });
      }
    } else {
      // If the user doesn't exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(40).toString("hex");

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationToken,
        role: userType,
        isVerified: false,
      });

      await sendVerificationEmail({
        username: newUser.username,
        email: newUser.email,
        verificationToken: newUser.verificationToken,
        userType: newUser.role,
        origin: process.env.ORIGIN,
      });

      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

module.exports = Register;
