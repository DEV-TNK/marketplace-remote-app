const UserActivity = require("../../models/UserActivities")


const userActivities = async (req, res) => {
    await UserActivity.sync();
    try {
        const { UserAction, UserId, UserEmail, ActionType} = req.body
        const details = [
            "UserAction", "UserId", "UserEmail", "ActionType"
        ]
         for (const detail of details) {
      if (!req.body[detail]) {
        return res.status(400).json({ message: `${detail} is required` });
      }
      const userAgent = req.headers["user-agent"];
      const createActivity = await UserActivity.create({
        UserAction, 
        UserId, 
        UserEmail, 
        UserIp: userAgent, 
        DateCreated: new Date(), 
        ActionType
      })
      return res.status(201).json({message: "Action completed", createActivity})
    }
    } catch (error) {
        console.error("Error creating conflict resolution:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = userActivities