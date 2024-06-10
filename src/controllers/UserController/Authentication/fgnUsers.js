const User = require("../../../models/Users");
const bcrypt = require("bcryptjs");
const {SeekerResume} = require("../../../models/SeekerResume")
const JobPoster = require("../../../models/JobPoster")
const Token = require("../../../models/Token");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../utils/generateToken");


const RegisterFgnUsers = async (req, res) => {
  try {
    await User.sync();

    const { username, email, password, userType, imageUrl } = req.body;
    const details = ["username", "userType", "email", "password", "imageUrl"];

    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ message: `${detail} is required` });
      }
    }
    const duplicateUser = await User.findOne({
      where: {
        email: email,
      },
    });
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36';
    let accessToken;
    let refreshToken; 
    
    if (duplicateUser) {
         accessToken = generateAccessToken(duplicateUser.id, duplicateUser.role);
        refreshToken = generateRefreshToken(duplicateUser.id, duplicateUser.role);
        const accessTokenExpiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
        const refreshTokenExpiration = new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000
        ); // 15 days from now
        await Token.create({
          accessToken: accessToken,
          refreshToken: refreshToken,
          userId: duplicateUser.id,
          userAgent: userAgent,
          accessTokenExpiration: accessTokenExpiration,
          refreshTokenExpiration: refreshTokenExpiration,
        });
        let setProfile = false;
         const hasInterests =
        duplicateUser.interest && duplicateUser.interest !== null ? "yes" : "no";

      if (duplicateUser.role === "provider") {
        const jobPoster = await JobPoster.findOne({
          jobPosterId: duplicateUser.id
        })
         if(jobPoster){
          setProfile = true;
        }else {
          setProfile = false;
        }
      } else if(duplicateUser.role === "seeker"){
         const userProfile = await SeekerResume.findOne({
          where: {
          userId: duplicateUser.id,
        },
        })
        if(userProfile){
          setProfile = true;
        }else {
          setProfile = false;
        }
      }

      const userSubset = {
        UserId: duplicateUser.id,
        username: duplicateUser.username,
        email: duplicateUser.email,
        role: duplicateUser.role,
        image: duplicateUser.imageUrl,
        interest: hasInterests,
        profile: setProfile,
        // Add other properties you want to include
      };
      return res
        .status(200)
        .json({
          message: "Login successfull for old users",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: userSubset,
          duplicateUser
        });
      

    } else {
      // If the user doesn't exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        email,
        imageUrl,
        password: hashedPassword,
        verificationToken: "",
        role: userType,
        isVerified: true
      });

      accessToken = generateAccessToken(newUser.id, newUser.role);
      refreshToken = generateRefreshToken(newUser.id, newUser.role);

        const accessTokenExpiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
        const refreshTokenExpiration = new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000
        ); // 15 days from now
        // Save the new tokens to the database
        await Token.create({
          accessToken: accessToken,
          refreshToken: refreshToken,
          userId: newUser.id,
          userAgent: userAgent,
          accessTokenExpiration: accessTokenExpiration,
          refreshTokenExpiration: refreshTokenExpiration,
        });

        let setProfile = false;
         const hasInterests =
        newUser.interest && user.interest !== null ? "yes" : "no";

      if (newUser.role === "provider") {
        const jobPoster = await JobPoster.findOne({
          jobPosterId: newUser.id
        })
         if(jobPoster){
          setProfile = true;
        }else {
          setProfile = false;
        }
      } else if(newUser.role === "seeker"){
         const userProfile = await SeekerResume.findOne({
          where: {
          userId: newUser.id,
        },
        })
        if(userProfile){
          setProfile = true;
        }else {
          setProfile = false;
        }
      }

      const userSubset = {
        UserId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        image: newUser.imageUrl,
        interest: hasInterests,
        profile: setProfile,
        // Add other properties you want to include
      };
      return res
        .status(200)
        .json({
          message: "Login successfull for new users",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: userSubset,
          
        });

    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};


const getFgnUsers = async (req, res) => {
  const userId = req.params.userId
  if(!userId){
     return res.status(400).json({ message: `User Id is required` });
  }
  const user = await User.findByPk(userId)
  const token = await Token.findOne({
    where: {
     userId: userId 
    }
  })
  console.log("this is token", token)
   const userSubset = {
        UserId:user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.imageUrl,
   }
   return res
        .status(200)
        .json({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          data: userSubset,
          
        }); 
}

module.exports = {RegisterFgnUsers, getFgnUsers};
