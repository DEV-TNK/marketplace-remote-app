const User = require("../../../models/Users");
const bcrypt = require("bcryptjs");
const Token = require("../../../models/Token");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../utils/generateToken");
const { SeekerResume } = require("../../../models/SeekerResume")
const JobPoster = require("../../../models/JobPoster")
const ServiceProvider = require("../../../models/serviceprovider");


const Login = async (req, res) => {
  try {
    await Token.sync();
    const { email, password, userType } = req.body;
    const details = ["password", "email", "userType"];

    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ message: `${detail} is required` });
      }
    }
    const user = await User.findOne({
      where: {
        email: email,
        role: userType,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid email Credential" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid password Credential" });
    }
    // to check if a user have been verified
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ msg: "Please Check your mail to verify your account" });
    }

    // to check for token
    const userTokens = await Token.findOne({
      where: {
        userId: user.id,
      },
    });
    const currentDate = new Date();
    const userAgent = req.headers["user-agent"];
    const hasInterests =
      user.interest && user.interest !== null ? "yes" : "no";
    if (
      userTokens

    ) {
      // Tokens exist and are valid, use them
      accessToken = generateAccessToken(user.id, user.role);
      refreshToken = generateRefreshToken(user.id, user.role);
      await userTokens.update({
        userAgent: userAgent,
      });
    } else {
      // Tokens don't exist or are invalid, generate new tokens
      accessToken = generateAccessToken(user.id, user.role);
      refreshToken = generateRefreshToken(user.id, user.role);

      const accessTokenExpiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
      const refreshTokenExpiration = new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ); // 15 days from now
      // Save the new tokens to the database
      await Token.create({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
        userAgent: userAgent,
        accessTokenExpiration: accessTokenExpiration,
        refreshTokenExpiration: refreshTokenExpiration,
      });
    }

    let setProfile = false;

    if (user.role === "provider") {
      const jobPoster = await JobPoster.findOne({
        jobPosterId: user.id
      })
      if (jobPoster) {
        setProfile = true;
      } else {
        setProfile = false;
      }
    } else if (user.role === "seeker") {
      const userProfile = await SeekerResume.findOne({
        where: {
          userId: user.id,
        },
      })
      if (userProfile) {
        setProfile = true;
      } else {
        setProfile = false;
      }
    } else if (user.role === "service provider") {
      // Modify only this section for service providers
      const onboardingDocument = await ServiceProvider.findOne({ userId: user.id });
      if (onboardingDocument) {
        setProfile = true;
      } else {
        setProfile = false
      }
    }

    const userSubset = {
      UserId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.imageUrl,
      interest: hasInterests,
      profile: setProfile,
      // Add other properties you want to include
    };
    return res
      .status(200)
      .json({
        message: "Login successfull",
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: userSubset,
      });
  }
  catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "internal server error", error });
  }
};

module.exports = Login;