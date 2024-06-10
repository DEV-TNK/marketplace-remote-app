const JobPoster = require("../../models/JobPoster");
const Rating = require("../../models/Rating");
const User = require("../../models/Users");

const submitReview = async (req, res) => {
  try {
    await Rating.sync();
    const {
      user_id,
      jobId,
      jobposterId,
      jobTitle,
      rating,
      review,
      jobseekerId,
    } = req.body;

    const details = ["user_id", "jobId", "jobseekerId", "rating", "review"];

    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ message: `${detail} is required` });
      }
    }
    const newRating = await Rating.create({
      userId: user_id,
      jobId,
      jobposterId,
      jobseekerId,
      jobTitle,
      rating,
      review,
    });

    res.status(200).json({
      message: "Thank you for your feedback",
      newRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Rating.findAll({
      include: {
        model: User,
        attributes: ["username", "imageUrl"],
      },
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// const getReviewsByJobId = async (req, res)=>{
//     try {

//     } catch (error) {

//     }
// }

const getReviewsByProvider = async (req, res) => {
  try {
    const userId = req.params.userId.toString();
    const reviews = await Rating.findAll({
      where: { jobposterId: userId.toString() },
      include: {
        model: User,
        attributes: ["username", "imageUrl"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getReviewsBySeeker = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Rating.findAll({
      where: { jobseekerId: userId },
      include: {
        model: User,
        attributes: ["username", "imageUrl"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const editReview = async (req, res) => {
  const { id, userId, rating, review } = req.body;

  if (!id || !userId || !rating || !review) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingReview = await Rating.findOne({ where: { id, userId } });

    if (!existingReview) {
      return res
        .status(404)
        .json({
          message: "Review not found or not authorized to edit this review",
        });
    }

    existingReview.rating = rating;
    existingReview.review = review;
    await existingReview.save();

    res
      .status(200)
      .json({ message: "Review updated successfully", review: existingReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  submitReview,
  getAllReviews,
  getReviewsByProvider,
  getReviewsBySeeker,
  editReview,
};
