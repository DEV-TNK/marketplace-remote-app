const ConflictResolution = require("../../models/ConflictResolution");
const User = require("../../models/Users");
const sendConflictResolutionClosedEmail = require("../../utils/sendConflictResolutionClosed");
const sendConflictResolutionFeedbackEmail = require("../../utils/sendConflictResolutionFeedbackEmail");

const conflictResolution = async (req, res) => {
  await ConflictResolution.sync();
  try {
    const { userId, role, reason, message } = req.body;

    const details = ["userId", "role", "reason", "message"];
    for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ message: `${detail} is required` });
      }
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const conflictResolution = await ConflictResolution.create({
      userId,
      role,
      reason,
      message,
    });

    return res.status(201).json({
      message: "Conflict resolution created successfully",
      conflictResolution
    });
  } catch (error) {
    console.error("Error creating conflict resolution:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getConflictResolution = async (req, res) => {
  try {
    const conflicts = await ConflictResolution.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["username", "email"] }],
    });

    res.status(200).json({ conflicts });
  } catch (error) {
    console.error("Error fetching conflicts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMyConflictResolution = async (req, res) => {
  try {
    const { userId } = req.params;

    const conflicts = await ConflictResolution.findAll({
      where: {
        userId: userId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ conflicts });
  } catch (error) {
    console.error("Error fetching conflicts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const completedConflict = async (req, res) => {
  try {
    const { conflictResolutionId } = req.params;

    const conflict = await ConflictResolution.findByPk(conflictResolutionId, {
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });
    if (!conflict) {
      return res.status(404).json({ message: "Conflict resolution not found" });
    }

    await ConflictResolution.update(
      { status: "completed" },
      { where: { id: conflictResolutionId } }
    );
    await sendConflictResolutionClosedEmail({
      username: conflict.User.username,
      email: conflict.User.email,
      resolutionId: conflictResolutionId,
      reason: conflict.reason,
      message: conflict.message,
    });
    res
      .status(200)
      .json({ message: "Conflict resolution marked as completed" });
  } catch (error) {
    console.error("Error marking conflict as completed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const sendConflictResolutionFeedback = async (req, res) => {
  try {
    const { id, subject, message } = req.body;

    if (!id || !subject || !message) {
      return res
        .status(400)
        .send({ error: "id, subject, and message are required" });
    }

    const conflictResolution = await ConflictResolution.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });
    if (
      !conflictResolution ||
      !conflictResolution.User ||
      !conflictResolution.User.email ||
      !conflictResolution.User.username
    ) {
      return res.status(404).send({
        error: "Valid conflict report with username and email not found",
      });
    }

    const email = conflictResolution.User.email;
    const username = conflictResolution.User.username;
    const { reason } = conflictResolution;

    await sendConflictResolutionFeedbackEmail({
      username,
      email,
      subject,
      reason,
      message,
    });

    res.status(200).send({
      message: "Conflict Resolution Feedback email sent successfully",
    });
  } catch (error) {
    console.error("Error sending feedback email:", error);
    res
      .status(500)
      .send({ error: "An error occurred while sending the feedback email" });
  }
}

module.exports = {
  conflictResolution,
  getConflictResolution,
  completedConflict,
  getMyConflictResolution,
  sendConflictResolutionFeedback,
};
